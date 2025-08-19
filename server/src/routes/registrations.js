import express from "express";
import { query } from "../db.js";

const router = express.Router();

// Get registrations for an event
router.get("/event/:event_id", async (req, res) => {
  try {
    const rows = await query(
      "SELECT * FROM registrations WHERE event_id=$1",
      [req.params.event_id]
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching registrations:", err);
    res.status(500).json({ error: err.message });
  }
});

// 🟢 Get registrations for a student
router.get("/student/:user_id", async (req, res) => {
  try {
    const rows = await query(
      "SELECT * FROM registrations WHERE user_id=$1",
      [req.params.user_id]
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching student registrations:", err);
    res.status(500).json({ error: err.message });
  }
});

// Register for an event
router.post("/", async (req, res) => {
  try {
    let { event_id, user_id, name, email, phone } = req.body;

    // fallback demo student
    if (!user_id) user_id = 3;
    if (!name) name = "Johnny Smith";
    if (!email) email = "demo@student.edu";

    if (!event_id) {
      return res.status(400).json({ error: "Missing event_id" });
    }

    console.log("📥 Incoming registration:", { event_id, user_id, name, email, phone });

    // Prevent duplicate registration
    const existing = await query(
      "SELECT id FROM registrations WHERE event_id=$1 AND email=$2",
      [event_id, email]
    );
    console.log("🔎 Existing registration check:", existing);

    if (existing.length > 0) {
      return res.status(400).json({ error: "Already registered with this email" });
    }

    // Insert registration
    const inserted = await query(
      `INSERT INTO registrations (event_id, user_id, name, email, phone)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      [event_id, user_id, name, email, phone]
    );

    console.log("✅ Inserted registration:", inserted[0]);
    res.json(inserted[0]);
  } catch (err) {
    console.error("❌ Error inserting registration:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
