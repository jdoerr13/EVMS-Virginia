import express from "express";
import { query } from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const rows = await query(
      `SELECT DISTINCT
         e.id,
         e.title,
         e.description,
         e.date,
         e.start_time,
         e.end_time,
         e.status,
         e.max_capacity,
         c.name as college,
         v.name as venue,
         u.name as requester_name
       FROM events e
       LEFT JOIN colleges c ON c.id = e.college_id
       LEFT JOIN venues v   ON v.id = e.venue_id
       LEFT JOIN users u    ON u.id = e.requester_id
       ORDER BY e.date DESC, e.id DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Get one event by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const rows = await query(
      `SELECT 
         e.id,
         e.title, e.description, e.date, e.start_time, e.end_time,
         e.status, e.max_capacity,
         c.name as college,
         v.name as venue,
         u.name as requester_name
       FROM events e
       LEFT JOIN colleges c ON c.id = e.college_id
       LEFT JOIN venues v   ON v.id = e.venue_id
       LEFT JOIN users u    ON u.id = e.requester_id
       WHERE e.id = $1`,
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Event not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new event
router.post("/", async (req, res) => {
  try {
    const {
      title, description, college_id, venue_id,
      date, start_time, end_time, max_capacity,
      status, requester_id
    } = req.body;

    const rows = await query(
      `INSERT INTO events 
        (title, description, college_id, venue_id, date, start_time, end_time, max_capacity, status, requester_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) 
       RETURNING *`,
      [
        title, description, college_id, venue_id,
        date, start_time, end_time, max_capacity,
        status || "Pending", requester_id
      ]
    );

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
