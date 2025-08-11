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
    const uploadDir = path.join(process.cwd(), 'uploads', 'migrations');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'migration-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only CSV and Excel files are allowed.'), false);
    }
  }
});

// Upload migration file
router.post("/upload", requireAuth(["admin"]), upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { migrationType, description } = req.body;
    
    // Log migration attempt
    const { rows } = await query(
      `INSERT INTO migration_logs (filename, original_name, file_path, migration_type, description, status, uploaded_by)
       VALUES ($1, $2, $3, $4, $5, 'processing', $6) RETURNING *`,
      [
        req.file.filename,
        req.file.originalname,
        req.file.path,
        migrationType || 'unknown',
        description || null,
        req.user.id
      ]
    );

    const migrationLog = rows[0];

    // Simulate migration processing (in a real app, this would be async)
    setTimeout(async () => {
      try {
        // Parse file and simulate data processing
        const fileContent = fs.readFileSync(req.file.path, 'utf8');
        const lines = fileContent.split('\n').filter(line => line.trim());
        const processedRows = lines.length - 1; // Exclude header
        
        // Update migration log with results
        await query(
          `UPDATE migration_logs 
           SET status = 'completed', 
               processed_rows = $1, 
               completed_at = NOW(),
               result_message = $2
           WHERE id = $3`,
          [
            processedRows,
            `Successfully processed ${processedRows} rows from ${req.file.originalname}`,
            migrationLog.id
          ]
        );
      } catch (error) {
        // Update migration log with error
        await query(
          `UPDATE migration_logs 
           SET status = 'failed', 
               completed_at = NOW(),
               result_message = $1
           WHERE id = $2`,
          [`Migration failed: ${error.message}`, migrationLog.id]
        );
      }
    }, 2000); // Simulate 2-second processing time

    res.status(201).json({
      id: migrationLog.id,
      filename: migrationLog.filename,
      originalName: migrationLog.original_name,
      status: migrationLog.status,
      message: "Migration file uploaded and processing started"
    });

  } catch (error) {
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: "Failed to upload migration file" });
  }
});

// Get migration logs
router.get("/logs", requireAuth(["admin"]), async (req, res) => {
  const { status, startDate, endDate, limit = 50 } = req.query;
  
  let whereClause = "";
  let params = [];
  
  if (status) {
    whereClause = "WHERE status = $1";
    params.push(status);
  }
  
  if (startDate && endDate) {
    const dateFilter = "WHERE created_at >= $1 AND created_at <= $2";
    if (whereClause) {
      whereClause = whereClause.replace("WHERE", "AND");
      whereClause = `WHERE created_at >= $${params.length + 1} AND created_at <= $${params.length + 2} ${whereClause}`;
      params.push(startDate, endDate);
    } else {
      whereClause = dateFilter;
      params.push(startDate, endDate);
    }
  }
  
  params.push(parseInt(limit));
  
  const { rows } = await query(
    `SELECT ml.*, u.name as uploaded_by_name
     FROM migration_logs ml
     LEFT JOIN users u ON u.id = ml.uploaded_by
     ${whereClause}
     ORDER BY ml.created_at DESC
     LIMIT $${params.length}`,
    params
  );
  
  res.json(rows);
});

// Get migration log details
router.get("/logs/:id", requireAuth(["admin"]), async (req, res) => {
  const { id } = req.params;
  
  const { rows } = await query(
    `SELECT ml.*, u.name as uploaded_by_name
     FROM migration_logs ml
     LEFT JOIN users u ON u.id = ml.uploaded_by
     WHERE ml.id = $1`,
    [id]
  );
  
  if (rows.length === 0) {
    return res.status(404).json({ error: "Migration log not found" });
  }
  
  res.json(rows[0]);
});

// Retry failed migration
router.post("/logs/:id/retry", requireAuth(["admin"]), async (req, res) => {
  const { id } = req.params;
  
  // Get migration log
  const { rows } = await query("SELECT * FROM migration_logs WHERE id = $1", [id]);
  if (rows.length === 0) {
    return res.status(404).json({ error: "Migration log not found" });
  }
  
  const migrationLog = rows[0];
  
  if (migrationLog.status !== 'failed') {
    return res.status(400).json({ error: "Only failed migrations can be retried" });
  }
  
  // Check if file still exists
  if (!fs.existsSync(migrationLog.file_path)) {
    return res.status(400).json({ error: "Migration file no longer exists" });
  }
  
  // Update status to processing
  await query(
    `UPDATE migration_logs 
     SET status = 'processing', 
         retry_count = COALESCE(retry_count, 0) + 1,
         updated_at = NOW()
     WHERE id = $1`,
    [id]
  );
  
  // Simulate retry processing
  setTimeout(async () => {
    try {
      const fileContent = fs.readFileSync(migrationLog.file_path, 'utf8');
      const lines = fileContent.split('\n').filter(line => line.trim());
      const processedRows = lines.length - 1;
      
      await query(
        `UPDATE migration_logs 
         SET status = 'completed', 
             processed_rows = $1, 
             completed_at = NOW(),
             result_message = $2
         WHERE id = $3`,
        [
          processedRows,
          `Retry successful: Processed ${processedRows} rows from ${migrationLog.original_name}`,
          id
        ]
      );
    } catch (error) {
      await query(
        `UPDATE migration_logs 
         SET status = 'failed', 
             completed_at = NOW(),
             result_message = $1
         WHERE id = $2`,
        [`Retry failed: ${error.message}`, id]
      );
    }
  }, 2000);
  
  res.json({
    id: migrationLog.id,
    status: 'processing',
    message: "Migration retry started"
  });
});

// Delete migration log and file
router.delete("/logs/:id", requireAuth(["admin"]), async (req, res) => {
  const { id } = req.params;
  
  // Get migration log
  const { rows } = await query("SELECT * FROM migration_logs WHERE id = $1", [id]);
  if (rows.length === 0) {
    return res.status(404).json({ error: "Migration log not found" });
  }
  
  const migrationLog = rows[0];
  
  // Delete file from filesystem
  if (fs.existsSync(migrationLog.file_path)) {
    fs.unlinkSync(migrationLog.file_path);
  }
  
  // Delete from database
  await query("DELETE FROM migration_logs WHERE id = $1", [id]);
  
  res.json({ message: "Migration log deleted successfully" });
});

// Get migration statistics
router.get("/stats", requireAuth(["admin"]), async (req, res) => {
  const { rows } = await query(
    `SELECT 
       COUNT(*) as total_migrations,
       COUNT(CASE WHEN status = 'completed' THEN 1 END) as successful,
       COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed,
       COUNT(CASE WHEN status = 'processing' THEN 1 END) as processing,
       SUM(processed_rows) as total_processed_rows,
       AVG(EXTRACT(EPOCH FROM (completed_at - created_at))) as avg_processing_time_seconds
     FROM migration_logs`
  );
  
  res.json(rows[0]);
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 50MB.' });
    }
    return res.status(400).json({ error: error.message });
  }
  
  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({ error: error.message });
  }
  
  next(error);
});

export default router;
