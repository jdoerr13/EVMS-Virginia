import { Router } from "express";
import bcrypt from "bcrypt";
import { query } from "../db.js";
import { z } from "zod";
import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

const createUserSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(["admin", "eventManager", "student"]),
    name: z.string().min(1),
    collegeId: z.number().int().nullable().optional()
  })
});

const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    role: z.enum(["admin", "eventManager", "student"]).optional(),
    collegeId: z.number().int().nullable().optional()
  })
});

// Create new user (Admin only)
router.post("/", requireAuth(["admin"]), validate(createUserSchema), async (req, res) => {
  const { email, password, role, name, collegeId } = req.body;
  
  // Check if user already exists
  const existingUser = await query("SELECT id FROM users WHERE email = $1", [email]);
  if (existingUser.rows.length > 0) {
    return res.status(400).json({ error: "User already exists" });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const { rows } = await query(
    `INSERT INTO users (email, password, role, name, college_id) 
     VALUES ($1, $2, $3, $4, $5) RETURNING id, email, role, name, college_id`,
    [email, hashedPassword, role, name, collegeId || null]
  );
  
  res.status(201).json(rows[0]);
});

// Get all users (Admin only)
router.get("/", requireAuth(["admin"]), async (req, res) => {
  const { rows } = await query(
    `SELECT u.id, u.email, u.role, u.name, u.created_at, c.name as college
     FROM users u
     LEFT JOIN colleges c ON c.id = u.college_id
     ORDER BY u.created_at DESC`
  );
  res.json(rows);
});

// Get current user profile
router.get("/profile", requireAuth(), async (req, res) => {
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

// Update user profile
router.patch("/profile", requireAuth(), validate(updateUserSchema), async (req, res) => {
  const { name, email, role, collegeId } = req.body;
  const updates = [];
  const params = [];
  let paramCount = 1;

  if (name !== undefined) {
    updates.push(`name = $${paramCount++}`);
    params.push(name);
  }
  if (email !== undefined) {
    updates.push(`email = $${paramCount++}`);
    params.push(email);
  }
  if (role !== undefined) {
    updates.push(`role = $${paramCount++}`);
    params.push(role);
  }
  if (collegeId !== undefined) {
    updates.push(`college_id = $${paramCount++}`);
    params.push(collegeId);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: "No fields to update" });
  }

  params.push(req.user.id);
  const { rows } = await query(
    `UPDATE users SET ${updates.join(", ")}, updated_at = NOW() 
     WHERE id = $${paramCount} RETURNING id, email, role, name, college_id`,
    params
  );

  if (rows.length === 0) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(rows[0]);
});

// Delete user (Admin only)
router.delete("/:id", requireAuth(["admin"]), async (req, res) => {
  const { id } = req.params;
  
  // Prevent admin from deleting themselves
  if (parseInt(id) === req.user.id) {
    return res.status(400).json({ error: "Cannot delete your own account" });
  }

  const { rows } = await query("DELETE FROM users WHERE id = $1 RETURNING id", [id]);
  
  if (rows.length === 0) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({ message: "User deleted successfully" });
});

export default router;
