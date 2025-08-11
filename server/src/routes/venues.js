import { Router } from "express";
import { query } from "../db.js";
import { z } from "zod";
import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

const createVenueSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    capacity: z.number().int().positive().optional(),
    description: z.string().optional(),
    location: z.string().optional(),
    amenities: z.array(z.string()).optional(),
    hourlyRate: z.number().positive().optional(),
    isActive: z.boolean().optional()
  })
});

const updateVenueSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    capacity: z.number().int().positive().optional(),
    description: z.string().optional(),
    location: z.string().optional(),
    amenities: z.array(z.string()).optional(),
    hourlyRate: z.number().positive().optional(),
    isActive: z.boolean().optional()
  })
});

// Get all venues
router.get("/", async (req, res) => {
  const { active } = req.query;
  
  let whereClause = "";
  let params = [];
  
  if (active === "true") {
    whereClause = "WHERE is_active = true";
  } else if (active === "false") {
    whereClause = "WHERE is_active = false";
  }

  const { rows } = await query(
    `SELECT id, name, capacity, description, location, amenities, hourly_rate, is_active
     FROM venues 
     ${whereClause}
     ORDER BY name`,
    params
  );
  res.json(rows);
});

// Get venue by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  
  const { rows } = await query(
    `SELECT id, name, capacity, description, location, amenities, hourly_rate, is_active, created_at, updated_at
     FROM venues 
     WHERE id = $1`,
    [id]
  );
  
  if (rows.length === 0) {
    return res.status(404).json({ error: "Venue not found" });
  }
  
  res.json(rows[0]);
});

// Create new venue (Admin/Event Manager only)
router.post("/", requireAuth(["admin", "eventManager"]), validate(createVenueSchema), async (req, res) => {
  const { name, capacity, description, location, amenities, hourlyRate, isActive = true } = req.body;
  
  // Check if venue with same name already exists
  const existingVenue = await query("SELECT id FROM venues WHERE name = $1", [name]);
  if (existingVenue.rows.length > 0) {
    return res.status(400).json({ error: "Venue with this name already exists" });
  }
  
  const { rows } = await query(
    `INSERT INTO venues (name, capacity, description, location, amenities, hourly_rate, is_active)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [name, capacity || null, description || null, location || null, amenities || [], hourlyRate || null, isActive]
  );
  
  res.status(201).json(rows[0]);
});

// Update venue (Admin/Event Manager only)
router.patch("/:id", requireAuth(["admin", "eventManager"]), validate(updateVenueSchema), async (req, res) => {
  const { id } = req.params;
  const { name, capacity, description, location, amenities, hourlyRate, isActive } = req.body;
  
  // Check if venue exists
  const venueCheck = await query("SELECT id FROM venues WHERE id = $1", [id]);
  if (venueCheck.rows.length === 0) {
    return res.status(404).json({ error: "Venue not found" });
  }
  
  // Check if name is being changed and if it conflicts
  if (name) {
    const nameCheck = await query("SELECT id FROM venues WHERE name = $1 AND id != $2", [name, id]);
    if (nameCheck.rows.length > 0) {
      return res.status(400).json({ error: "Venue with this name already exists" });
    }
  }
  
  const updates = [];
  const params = [];
  let paramCount = 1;

  if (name !== undefined) {
    updates.push(`name = $${paramCount++}`);
    params.push(name);
  }
  if (capacity !== undefined) {
    updates.push(`capacity = $${paramCount++}`);
    params.push(capacity);
  }
  if (description !== undefined) {
    updates.push(`description = $${paramCount++}`);
    params.push(description);
  }
  if (location !== undefined) {
    updates.push(`location = $${paramCount++}`);
    params.push(location);
  }
  if (amenities !== undefined) {
    updates.push(`amenities = $${paramCount++}`);
    params.push(amenities);
  }
  if (hourlyRate !== undefined) {
    updates.push(`hourly_rate = $${paramCount++}`);
    params.push(hourlyRate);
  }
  if (isActive !== undefined) {
    updates.push(`is_active = $${paramCount++}`);
    params.push(isActive);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: "No fields to update" });
  }

  params.push(id);
  const { rows } = await query(
    `UPDATE venues SET ${updates.join(", ")}, updated_at = NOW() 
     WHERE id = $${paramCount} RETURNING *`,
    params
  );

  res.json(rows[0]);
});

// Delete venue (Admin only)
router.delete("/:id", requireAuth(["admin"]), async (req, res) => {
  const { id } = req.params;
  
  // Check if venue has any events
  const eventCheck = await query("SELECT id FROM events WHERE venue_id = $1", [id]);
  if (eventCheck.rows.length > 0) {
    return res.status(400).json({ error: "Cannot delete venue with existing events" });
  }
  
  const { rows } = await query("DELETE FROM venues WHERE id = $1 RETURNING id", [id]);
  
  if (rows.length === 0) {
    return res.status(404).json({ error: "Venue not found" });
  }

  res.json({ message: "Venue deleted successfully" });
});

// Get venue availability
router.get("/:id/availability", async (req, res) => {
  const { id } = req.params;
  const { startDate, endDate } = req.query;
  
  if (!startDate || !endDate) {
    return res.status(400).json({ error: "startDate and endDate are required" });
  }
  
  const { rows } = await query(
    `SELECT e.id, e.title, e.date, e.start_time, e.end_time, e.status
     FROM events e
     WHERE e.venue_id = $1 
       AND e.date >= $2 
       AND e.date <= $3
       AND e.status != 'Rejected'
     ORDER BY e.date, e.start_time`,
    [id, startDate, endDate]
  );
  
  res.json(rows);
});

// Get venue statistics
router.get("/:id/stats", requireAuth(["admin", "eventManager"]), async (req, res) => {
  const { id } = req.params;
  const { startDate, endDate } = req.query;
  
  let dateFilter = "";
  let params = [id];
  
  if (startDate && endDate) {
    dateFilter = "AND e.date >= $2 AND e.date <= $3";
    params = [id, startDate, endDate];
  }

  const { rows } = await query(
    `SELECT 
       COUNT(*) as total_events,
       COUNT(CASE WHEN e.status = 'Approved' THEN 1 END) as approved_events,
       COUNT(CASE WHEN e.status = 'Pending' THEN 1 END) as pending_events,
       COUNT(DISTINCT e.requester_id) as unique_requesters,
       COUNT(r.id) as total_registrations,
       ROUND(AVG(COUNT(r.id)::float / NULLIF(v.capacity, 0)) * 100, 2) as avg_utilization
     FROM events e
     LEFT JOIN registrations r ON r.event_id = e.id AND r.status != 'cancelled'
     LEFT JOIN venues v ON v.id = e.venue_id
     WHERE e.venue_id = $1 ${dateFilter}
     GROUP BY v.capacity`,
    params
  );
  
  res.json(rows[0] || {
    total_events: 0,
    approved_events: 0,
    pending_events: 0,
    unique_requesters: 0,
    total_registrations: 0,
    avg_utilization: 0
  });
});

export default router;