// routes/venues.js
import express from "express";
import { query } from "../db.js";

const router = express.Router();

// List all venues
router.get("/", async (req, res) => {
  try {
    const rows = await query("SELECT * FROM venues ORDER BY name");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// (Optional) Add new venue
router.post("/", async (req, res) => {
  try {
    const { name, capacity, description, location } = req.body;
    const rows = await query(
      "INSERT INTO venues (name, capacity, description, location) VALUES ($1,$2,$3,$4) RETURNING *",
      [name, capacity, description, location]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
