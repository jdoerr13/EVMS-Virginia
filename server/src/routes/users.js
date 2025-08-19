// routes/users.js
import express from "express";
import { query } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Get all users (admin only)
router.get("/", requireAuth(["admin"]), async (req, res) => {
  try {
    const rows = await query("SELECT id, email, name, role, college_id FROM users ORDER BY id");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get current user (self)
router.get("/me", requireAuth(), async (req, res) => {
  try {
    const rows = await query("SELECT id, email, name, role, college_id FROM users WHERE id=$1", [req.user.id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
