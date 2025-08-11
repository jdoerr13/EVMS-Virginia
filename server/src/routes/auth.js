import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { query } from "../db.js";
import { z } from "zod";
import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6)
  })
});

const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(1),
    role: z.enum(["admin", "eventManager", "student"]).default("student"),
    collegeId: z.number().int().nullable().optional()
  })
});

// Login
router.post("/login", validate(loginSchema), async (req, res) => {
  const { email, password } = req.body;
  const { rows } = await query("SELECT * FROM users WHERE email=$1", [email]);
  const user = rows[0];
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" });
  const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, { expiresIn: "7d" });
  
  res.json({ token, refreshToken, role: user.role, user: { id: user.id, email: user.email, name: user.name } });
});

// Register
router.post("/register", validate(registerSchema), async (req, res) => {
  const { email, password, name, role, collegeId } = req.body;
  
  // Check if user already exists
  const existingUser = await query("SELECT id FROM users WHERE email = $1", [email]);
  if (existingUser.rows.length > 0) {
    return res.status(400).json({ error: "User already exists" });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const { rows } = await query(
    `INSERT INTO users (email, password, role, name, college_id) 
     VALUES ($1, $2, $3, $4, $5) RETURNING id, email, role, name`,
    [email, hashedPassword, role, name, collegeId || null]
  );
  
  const user = rows[0];
  const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" });
  const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, { expiresIn: "7d" });
  
  res.status(201).json({ token, refreshToken, role: user.role, user: { id: user.id, email: user.email, name: user.name } });
});

// Get current user
router.get("/me", requireAuth(), async (req, res) => {
  const { rows } = await query(
    `SELECT u.id, u.email, u.role, u.name, u.created_at, c.name as college
     FROM users u
     LEFT JOIN colleges c ON c.id = u.college_id
     WHERE u.id = $1`,
    [req.user.id]
  );
  
  if (rows.length === 0) {
    return res.status(404).json({ error: "User not found" });
  }
  
  res.json(rows[0]);
});

// Refresh token
router.post("/refresh-token", async (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token required" });
  }

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
    
    // Get user data
    const { rows } = await query("SELECT id, email, role FROM users WHERE id = $1", [payload.id]);
    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }
    
    const user = rows[0];
    const newToken = jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" });
    const newRefreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, { expiresIn: "7d" });
    
    res.json({ token: newToken, refreshToken: newRefreshToken });
  } catch (error) {
    res.status(401).json({ error: "Invalid refresh token" });
  }
});

export default router;
