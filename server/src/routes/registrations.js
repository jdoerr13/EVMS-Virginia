import { Router } from "express";
import { query } from "../db.js";
import { z } from "zod";
import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

const createRegistrationSchema = z.object({
  body: z.object({
    eventId: z.number().int(),
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    dietaryRestrictions: z.string().optional(),
    specialAccommodations: z.string().optional(),
    userId: z.number().int().nullable().optional()
  })
});

const updateRegistrationSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    dietaryRestrictions: z.string().optional(),
    specialAccommodations: z.string().optional(),
    status: z.enum(["confirmed", "cancelled", "waitlist"]).optional()
  })
});

// Create new registration
router.post("/", validate(createRegistrationSchema), async (req, res) => {
  const { eventId, name, email, phone, dietaryRestrictions, specialAccommodations, userId } = req.body;

  // Check if event exists and is approved
  const eventCheck = await query(
    "SELECT id, title, max_capacity FROM events WHERE id = $1 AND status = 'Approved'",
    [eventId]
  );
  
  if (eventCheck.rows.length === 0) {
    return res.status(400).json({ error: "Event not found or not approved" });
  }

  // Check if user is already registered
  const existingRegistration = await query(
    "SELECT id FROM registrations WHERE event_id = $1 AND email = $2",
    [eventId, email]
  );
  
  if (existingRegistration.rows.length > 0) {
    return res.status(400).json({ error: "Already registered for this event" });
  }

  // Check capacity
  const currentRegistrations = await query(
    "SELECT COUNT(*) as count FROM registrations WHERE event_id = $1 AND status != 'cancelled'",
    [eventId]
  );
  
  const event = eventCheck.rows[0];
  if (event.max_capacity && currentRegistrations.rows[0].count >= event.max_capacity) {
    return res.status(400).json({ error: "Event is at full capacity" });
  }

  const { rows } = await query(
    `INSERT INTO registrations (event_id, user_id, name, email, phone, dietary_restrictions, special_accommodations, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, 'confirmed') RETURNING *`,
    [eventId, userId || null, name, email, phone || null, dietaryRestrictions || null, specialAccommodations || null]
  );

  res.status(201).json(rows[0]);
});

// Get registrations for an event (Event Manager/Admin only)
router.get("/event/:eventId", requireAuth(["admin", "eventManager"]), async (req, res) => {
  const { eventId } = req.params;
  
  const { rows } = await query(
    `SELECT r.*, e.title as event_title, e.date as event_date
     FROM registrations r
     JOIN events e ON e.id = r.event_id
     WHERE r.event_id = $1
     ORDER BY r.created_at DESC`,
    [eventId]
  );
  
  res.json(rows);
});

// Get user's registrations
router.get("/my-registrations", requireAuth(), async (req, res) => {
  const { rows } = await query(
    `SELECT r.*, e.title, e.date, e.venue_id, v.name as venue_name
     FROM registrations r
     JOIN events e ON e.id = r.event_id
     LEFT JOIN venues v ON v.id = e.venue_id
     WHERE r.user_id = $1
     ORDER BY e.date DESC`,
    [req.user.id]
  );
  
  res.json(rows);
});

// Update registration
router.patch("/:id", requireAuth(["admin", "eventManager"]), validate(updateRegistrationSchema), async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, dietaryRestrictions, specialAccommodations, status } = req.body;
  
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
  if (phone !== undefined) {
    updates.push(`phone = $${paramCount++}`);
    params.push(phone);
  }
  if (dietaryRestrictions !== undefined) {
    updates.push(`dietary_restrictions = $${paramCount++}`);
    params.push(dietaryRestrictions);
  }
  if (specialAccommodations !== undefined) {
    updates.push(`special_accommodations = $${paramCount++}`);
    params.push(specialAccommodations);
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
    `UPDATE registrations SET ${updates.join(", ")}, updated_at = NOW() 
     WHERE id = $${paramCount} RETURNING *`,
    params
  );

  if (rows.length === 0) {
    return res.status(404).json({ error: "Registration not found" });
  }

  res.json(rows[0]);
});

// Cancel registration (user can cancel their own)
router.delete("/:id", requireAuth(), async (req, res) => {
  const { id } = req.params;
  
  // Check if user owns this registration or is admin/event manager
  const registration = await query(
    "SELECT user_id FROM registrations WHERE id = $1",
    [id]
  );
  
  if (registration.rows.length === 0) {
    return res.status(404).json({ error: "Registration not found" });
  }
  
  const isOwner = registration.rows[0].user_id === req.user.id;
  const isAdmin = ["admin", "eventManager"].includes(req.user.role);
  
  if (!isOwner && !isAdmin) {
    return res.status(403).json({ error: "Not authorized to cancel this registration" });
  }

  const { rows } = await query(
    "UPDATE registrations SET status = 'cancelled', updated_at = NOW() WHERE id = $1 RETURNING *",
    [id]
  );

  res.json(rows[0]);
});

// Get registration statistics for an event
router.get("/stats/:eventId", requireAuth(["admin", "eventManager"]), async (req, res) => {
  const { eventId } = req.params;
  
  const { rows } = await query(
    `SELECT 
       COUNT(*) as total_registrations,
       COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed,
       COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled,
       COUNT(CASE WHEN status = 'waitlist' THEN 1 END) as waitlist
     FROM registrations 
     WHERE event_id = $1`,
    [eventId]
  );
  
  res.json(rows[0]);
});

export default router;
