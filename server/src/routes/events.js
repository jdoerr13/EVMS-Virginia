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
    startTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
    endTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
    description: z.string().optional(),
    maxCapacity: z.number().int().positive().optional(),
    requesterId: z.number().int().nullable().optional()
  })
});

const updateEventSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    collegeId: z.number().int().nullable().optional(),
    venueId: z.number().int().nullable().optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    startTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
    endTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
    description: z.string().optional(),
    maxCapacity: z.number().int().positive().optional(),
    status: z.enum(["Pending", "Approved", "Rejected", "Tentative"]).optional()
  })
});

// Create event (Event Managers)
router.post(
  "/",
  requireAuth(["eventManager", "admin"]),
  validate(createEventSchema),
  async (req, res) => {
    const { title, collegeId, venueId, date, startTime, endTime, description, maxCapacity, requesterId } = req.body;
    const { rows } = await query(
      `INSERT INTO events (title, college_id, venue_id, date, start_time, end_time, description, max_capacity, status, requester_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'Pending',$9) RETURNING *`,
      [title, collegeId ?? null, venueId ?? null, date, startTime ?? null, endTime ?? null, description ?? null, maxCapacity ?? null, requesterId ?? req.user.id]
    );
    res.status(201).json(rows[0]);
  }
);

// List events (filters: status, date range, venueId, collegeId)
router.get("/", async (req, res) => {
  const { status, date, start, end, venueId, collegeId, search } = req.query;
  const clauses = [];
  const params = [];
  const add = (sql, v) => { params.push(v); clauses.push(sql.replace("?", `$${params.length}`)); };

  if (status) add("e.status = ?", status);
  if (date) add("e.date = ?", date);
  if (start) add("e.date >= ?", start);
  if (end) add("e.date <= ?", end);
  if (venueId) add("e.venue_id = ?", Number(venueId));
  if (collegeId) add("e.college_id = ?", Number(collegeId));
  if (search) add("(e.title ILIKE ? OR e.description ILIKE ?)", `%${search}%`, `%${search}%`);

  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const { rows } = await query(
    `SELECT e.*, c.name as college, v.name as venue, u.name as requester_name
     FROM events e
     LEFT JOIN colleges c ON c.id = e.college_id
     LEFT JOIN venues v   ON v.id = e.venue_id
     LEFT JOIN users u    ON u.id = e.requester_id
     ${where}
     ORDER BY e.date DESC, e.id DESC`,
    params
  );
  res.json(rows);
});

// Get single event
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const { rows } = await query(
    `SELECT e.*, c.name as college, v.name as venue, u.name as requester_name
     FROM events e
     LEFT JOIN colleges c ON c.id = e.college_id
     LEFT JOIN venues v   ON v.id = e.venue_id
     LEFT JOIN users u    ON u.id = e.requester_id
     WHERE e.id = $1`,
    [id]
  );
  
  if (rows.length === 0) {
    return res.status(404).json({ error: "Event not found" });
  }
  
  res.json(rows[0]);
});

// Update event
router.put(
  "/:id",
  requireAuth(["eventManager", "admin"]),
  validate(updateEventSchema),
  async (req, res) => {
    const { id } = req.params;
    const { title, collegeId, venueId, date, startTime, endTime, description, maxCapacity, status } = req.body;
    
    // Check if event exists
    const eventCheck = await query("SELECT id, requester_id FROM events WHERE id = $1", [id]);
    if (eventCheck.rows.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }
    
    // Only allow updates if user is admin, event manager, or the original requester
    const event = eventCheck.rows[0];
    if (req.user.role === "student" && event.requester_id !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to update this event" });
    }
    
    const updates = [];
    const params = [];
    let paramCount = 1;

    if (title !== undefined) {
      updates.push(`title = $${paramCount++}`);
      params.push(title);
    }
    if (collegeId !== undefined) {
      updates.push(`college_id = $${paramCount++}`);
      params.push(collegeId);
    }
    if (venueId !== undefined) {
      updates.push(`venue_id = $${paramCount++}`);
      params.push(venueId);
    }
    if (date !== undefined) {
      updates.push(`date = $${paramCount++}`);
      params.push(date);
    }
    if (startTime !== undefined) {
      updates.push(`start_time = $${paramCount++}`);
      params.push(startTime);
    }
    if (endTime !== undefined) {
      updates.push(`end_time = $${paramCount++}`);
      params.push(endTime);
    }
    if (description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      params.push(description);
    }
    if (maxCapacity !== undefined) {
      updates.push(`max_capacity = $${paramCount++}`);
      params.push(maxCapacity);
    }
    if (status !== undefined) {
      updates.push(`status = $${paramCount++}`);
      params.push(status);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    params.push(id);
    const { rows } = await query(
      `UPDATE events SET ${updates.join(", ")}, updated_at = NOW() 
       WHERE id = $${paramCount} RETURNING *`,
      params
    );

    res.json(rows[0]);
  }
);

// Hold event (mark as tentative)
router.post(
  "/:id/hold",
  requireAuth(["eventManager", "admin"]),
  async (req, res) => {
    const { id } = req.params;
    
    const { rows } = await query(
      "UPDATE events SET status = 'Tentative', updated_at = NOW() WHERE id = $1 RETURNING *",
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }
    
    res.json(rows[0]);
  }
);

// Approve/Reject (Admin)
router.patch(
  "/:id/status",
  requireAuth(["admin"]),
  async (req, res) => {
    const { id } = req.params;
    const { decision } = req.body; // "Approved" | "Rejected" | "Pending"
    if (!["Approved", "Rejected", "Pending", "Tentative"].includes(decision)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    const { rows } = await query(
      "UPDATE events SET status=$1, updated_at = NOW() WHERE id=$2 RETURNING *",
      [decision, Number(id)]
    );
    if (!rows[0]) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  }
);

// CSV export (Admin)
router.get("/export/csv", requireAuth(["admin", "eventManager"]), async (_req, res) => {
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
