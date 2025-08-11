import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { query } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow common document types
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/gif'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, Word, Excel, text, and image files are allowed.'), false);
    }
  }
});

// Upload document for an event
router.post(
  "/events/:eventId/docs",
  requireAuth(["admin", "eventManager"]),
  upload.single('document'),
  async (req, res) => {
    try {
      const { eventId } = req.params;
      const { description } = req.body;
      
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      
      // Check if event exists
      const eventCheck = await query("SELECT id FROM events WHERE id = $1", [eventId]);
      if (eventCheck.rows.length === 0) {
        // Remove uploaded file if event doesn't exist
        fs.unlinkSync(req.file.path);
        return res.status(404).json({ error: "Event not found" });
      }
      
      const { rows } = await query(
        `INSERT INTO documents (event_id, filename, original_name, file_path, description, uploaded_by)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [
          eventId,
          req.file.filename,
          req.file.originalname,
          req.file.path,
          description || null,
          req.user.id
        ]
      );
      
      res.status(201).json({
        id: rows[0].id,
        filename: rows[0].filename,
        originalName: rows[0].original_name,
        description: rows[0].description,
        uploadedAt: rows[0].created_at
      });
      
    } catch (error) {
      // Clean up uploaded file on error
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({ error: "Failed to upload document" });
    }
  }
);

// Get documents for an event
router.get(
  "/events/:eventId/docs",
  requireAuth(["admin", "eventManager"]),
  async (req, res) => {
    const { eventId } = req.params;
    
    // Check if event exists
    const eventCheck = await query("SELECT id FROM events WHERE id = $1", [eventId]);
    if (eventCheck.rows.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }
    
    const { rows } = await query(
      `SELECT d.id, d.filename, d.original_name, d.description, d.created_at, u.name as uploaded_by
       FROM documents d
       LEFT JOIN users u ON u.id = d.uploaded_by
       WHERE d.event_id = $1
       ORDER BY d.created_at DESC`,
      [eventId]
    );
    
    res.json(rows);
  }
);

// Download document
router.get(
  "/docs/:id/download",
  requireAuth(["admin", "eventManager"]),
  async (req, res) => {
    const { id } = req.params;
    
    const { rows } = await query(
      "SELECT * FROM documents WHERE id = $1",
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: "Document not found" });
    }
    
    const document = rows[0];
    
    // Check if file exists
    if (!fs.existsSync(document.file_path)) {
      return res.status(404).json({ error: "File not found on server" });
    }
    
    res.download(document.file_path, document.original_name);
  }
);

// Delete document
router.delete(
  "/docs/:id",
  requireAuth(["admin", "eventManager"]),
  async (req, res) => {
    const { id } = req.params;
    
    // Get document info
    const { rows } = await query(
      "SELECT * FROM documents WHERE id = $1",
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: "Document not found" });
    }
    
    const document = rows[0];
    
    // Delete file from filesystem
    if (fs.existsSync(document.file_path)) {
      fs.unlinkSync(document.file_path);
    }
    
    // Delete from database
    await query("DELETE FROM documents WHERE id = $1", [id]);
    
    res.json({ message: "Document deleted successfully" });
  }
);

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }
    return res.status(400).json({ error: error.message });
  }
  
  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({ error: error.message });
  }
  
  next(error);
});

export default router;
