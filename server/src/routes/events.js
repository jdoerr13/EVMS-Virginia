import { Router } from "express";
import { query } from "../db.js";
import { z } from "zod";
import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

const createEventSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    collegeId: z.number().int().nullable().optional(),
    venueId: z.number().int().nullable().optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    requesterId: z.number().int().nullable().optional()
  })
});

// Create event (Event Managers)
router.post(
  "/",
  // requireAuth(["eventManager", "admin"]), // enable when you move to JWT
  validate(createEventSchema),
  async (req, res) => {
    const { title, collegeId, venueId, date, requesterId } = req.body;
    const { rows } = await query(
      `INSERT INTO events (title, college_id, venue_id, date, status, requester_id)
       VALUES ($1,$2,$3,$4,'Pending',$5) RETURNING *`,
      [title, collegeId ?? null, venueId ?? null, date, requesterId ?? null]
    );
    res.status(201).json(rows[0]);
  }
);

// List events (filters: status, date range, venueId, collegeId)
router.get("/", async (req, res) => {
  const { status, date, start, end, venueId, collegeId } = req.query;
  const clauses = [];
  const params = [];
  const add = (sql, v) => { params.push(v); clauses.push(sql.replace("?", `$${params.length}`)); };

  if (status) add("status = ?", status);
  if (date) add("date = ?", date);
  if (start) add("date >= ?", start);
  if (end) add("date <= ?", end);
  if (venueId) add("venue_id = ?", Number(venueId));
  if (collegeId) add("college_id = ?", Number(collegeId));

  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const { rows } = await query(
    `SELECT e.*, c.name as college, v.name as venue
     FROM events e
     LEFT JOIN colleges c ON c.id = e.college_id
     LEFT JOIN venues v   ON v.id = e.venue_id
     ${where}
     ORDER BY e.date DESC, e.id DESC`,
    params
  );
  res.json(rows);
});

// Approve/Reject (Admin)
router.patch(
  "/:id/status",
  // requireAuth(["admin"]), // enable with JWT
  async (req, res) => {
    const { id } = req.params;
    const { decision } = req.body; // "Approved" | "Rejected"
    if (!["Approved", "Rejected", "Pending"].includes(decision)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    const { rows } = await query(
      "UPDATE events SET status=$1 WHERE id=$2 RETURNING *",
      [decision, Number(id)]
    );
    if (!rows[0]) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  }
);

// CSV export (Admin)
router.get("/export/csv", async (_req, res) => {
  const { rows } = await query(
    `SELECT e.title, c.name as college, v.name as venue, e.date, e.status, u.email as requester
     FROM events e
     LEFT JOIN colleges c ON c.id = e.college_id
     LEFT JOIN venues v   ON v.id = e.venue_id
     LEFT JOIN users u    ON u.id = e.requester_id
     ORDER BY e.date DESC`
  );
  const headers = ["Title","College","Venue","Date","Status","Requester"];
  const csv = [headers.join(","), ...rows.map(r =>
    [r.title, r.college ?? "", r.venue ?? "", r.date.toISOString().slice(0,10), r.status, r.requester ?? ""].join(",")
  )].join("\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=events.csv");
  res.send(csv);
});

export default router;
