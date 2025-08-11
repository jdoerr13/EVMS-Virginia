import { Router } from "express";
import { query } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Get overall system statistics
router.get("/overview", requireAuth(["admin", "eventManager"]), async (req, res) => {
  const { startDate, endDate } = req.query;
  
  let dateFilter = "";
  let params = [];
  
  if (startDate && endDate) {
    dateFilter = "WHERE e.date >= $1 AND e.date <= $2";
    params = [startDate, endDate];
  }

  const { rows } = await query(
    `SELECT 
       COUNT(*) as total_events,
       COUNT(CASE WHEN e.status = 'Approved' THEN 1 END) as approved_events,
       COUNT(CASE WHEN e.status = 'Pending' THEN 1 END) as pending_events,
       COUNT(CASE WHEN e.status = 'Rejected' THEN 1 END) as rejected_events,
       COUNT(DISTINCT e.requester_id) as unique_requesters,
       COUNT(DISTINCT e.venue_id) as venues_used
     FROM events e
     ${dateFilter}`,
    params
  );

  res.json(rows[0]);
});

// Get events by college
router.get("/by-college", requireAuth(["admin", "eventManager"]), async (req, res) => {
  const { startDate, endDate } = req.query;
  
  let dateFilter = "";
  let params = [];
  
  if (startDate && endDate) {
    dateFilter = "WHERE e.date >= $1 AND e.date <= $2";
    params = [startDate, endDate];
  }

  const { rows } = await query(
    `SELECT 
       c.name as college,
       COUNT(*) as total_events,
       COUNT(CASE WHEN e.status = 'Approved' THEN 1 END) as approved,
       COUNT(CASE WHEN e.status = 'Pending' THEN 1 END) as pending,
       COUNT(CASE WHEN e.status = 'Rejected' THEN 1 END) as rejected
     FROM events e
     LEFT JOIN colleges c ON c.id = e.college_id
     ${dateFilter}
     GROUP BY c.id, c.name
     ORDER BY total_events DESC`,
    params
  );

  res.json(rows);
});

// Get events by venue
router.get("/by-venue", requireAuth(["admin", "eventManager"]), async (req, res) => {
  const { startDate, endDate } = req.query;
  
  let dateFilter = "";
  let params = [];
  
  if (startDate && endDate) {
    dateFilter = "WHERE e.date >= $1 AND e.date <= $2";
    params = [startDate, endDate];
  }

  const { rows } = await query(
    `SELECT 
       v.name as venue,
       COUNT(*) as total_events,
       COUNT(CASE WHEN e.status = 'Approved' THEN 1 END) as approved,
       COUNT(CASE WHEN e.status = 'Pending' THEN 1 END) as pending,
       COUNT(CASE WHEN e.status = 'Rejected' THEN 1 END) as rejected
     FROM events e
     LEFT JOIN venues v ON v.id = e.venue_id
     ${dateFilter}
     GROUP BY v.id, v.name
     ORDER BY total_events DESC`,
    params
  );

  res.json(rows);
});

// Get monthly event trends
router.get("/monthly-trends", requireAuth(["admin", "eventManager"]), async (req, res) => {
  const { year } = req.query;
  const targetYear = year || new Date().getFullYear();

  const { rows } = await query(
    `SELECT 
       EXTRACT(MONTH FROM e.date) as month,
       COUNT(*) as total_events,
       COUNT(CASE WHEN e.status = 'Approved' THEN 1 END) as approved,
       COUNT(CASE WHEN e.status = 'Pending' THEN 1 END) as pending,
       COUNT(CASE WHEN e.status = 'Rejected' THEN 1 END) as rejected
     FROM events e
     WHERE EXTRACT(YEAR FROM e.date) = $1
     GROUP BY EXTRACT(MONTH FROM e.date)
     ORDER BY month`,
    [targetYear]
  );

  res.json(rows);
});

// Get registration statistics
router.get("/registrations", requireAuth(["admin", "eventManager"]), async (req, res) => {
  const { startDate, endDate } = req.query;
  
  let dateFilter = "";
  let params = [];
  
  if (startDate && endDate) {
    dateFilter = "WHERE e.date >= $1 AND e.date <= $2";
    params = [startDate, endDate];
  }

  const { rows } = await query(
    `SELECT 
       COUNT(*) as total_registrations,
       COUNT(CASE WHEN r.status = 'confirmed' THEN 1 END) as confirmed,
       COUNT(CASE WHEN r.status = 'cancelled' THEN 1 END) as cancelled,
       COUNT(CASE WHEN r.status = 'waitlist' THEN 1 END) as waitlist,
       COUNT(DISTINCT r.event_id) as events_with_registrations,
       COUNT(DISTINCT r.user_id) as unique_registrants
     FROM registrations r
     JOIN events e ON e.id = r.event_id
     ${dateFilter}`,
    params
  );

  res.json(rows[0]);
});

// Get top events by registration count
router.get("/top-events", requireAuth(["admin", "eventManager"]), async (req, res) => {
  const { limit = 10, startDate, endDate } = req.query;
  
  let dateFilter = "";
  let params = [limit];
  
  if (startDate && endDate) {
    dateFilter = "WHERE e.date >= $2 AND e.date <= $3";
    params = [limit, startDate, endDate];
  }

  const { rows } = await query(
    `SELECT 
       e.title,
       e.date,
       v.name as venue,
       c.name as college,
       COUNT(r.id) as registration_count,
       e.max_capacity,
       ROUND((COUNT(r.id)::float / NULLIF(e.max_capacity, 0)) * 100, 2) as capacity_percentage
     FROM events e
     LEFT JOIN registrations r ON r.event_id = e.id AND r.status != 'cancelled'
     LEFT JOIN venues v ON v.id = e.venue_id
     LEFT JOIN colleges c ON c.id = e.college_id
     ${dateFilter}
     GROUP BY e.id, e.title, e.date, v.name, c.name, e.max_capacity
     ORDER BY registration_count DESC
     LIMIT $1`,
    params
  );

  res.json(rows);
});

// Get user activity report
router.get("/user-activity", requireAuth(["admin"]), async (req, res) => {
  const { startDate, endDate } = req.query;
  
  let dateFilter = "";
  let params = [];
  
  if (startDate && endDate) {
    dateFilter = "WHERE e.date >= $1 AND e.date <= $2";
    params = [startDate, endDate];
  }

  const { rows } = await query(
    `SELECT 
       u.name,
       u.email,
       u.role,
       c.name as college,
       COUNT(e.id) as events_requested,
       COUNT(CASE WHEN e.status = 'Approved' THEN 1 END) as events_approved,
       COUNT(CASE WHEN e.status = 'Rejected' THEN 1 END) as events_rejected,
       COUNT(r.id) as registrations_made
     FROM users u
     LEFT JOIN events e ON e.requester_id = u.id ${dateFilter ? `AND ${dateFilter.replace('WHERE', '')}` : ''}
     LEFT JOIN registrations r ON r.user_id = u.id
     LEFT JOIN colleges c ON c.id = u.college_id
     GROUP BY u.id, u.name, u.email, u.role, c.name
     ORDER BY events_requested DESC`,
    params
  );

  res.json(rows);
});

// Get venue utilization report
router.get("/venue-utilization", requireAuth(["admin", "eventManager"]), async (req, res) => {
  const { startDate, endDate } = req.query;
  
  let dateFilter = "";
  let params = [];
  
  if (startDate && endDate) {
    dateFilter = "WHERE e.date >= $1 AND e.date <= $2";
    params = [startDate, endDate];
  }

  const { rows } = await query(
    `SELECT 
       v.name as venue,
       v.capacity,
       COUNT(e.id) as events_held,
       COUNT(CASE WHEN e.status = 'Approved' THEN 1 END) as approved_events,
       COUNT(r.id) as total_registrations,
       ROUND(AVG(COUNT(r.id)::float / NULLIF(v.capacity, 0)) * 100, 2) as avg_utilization_percentage
     FROM venues v
     LEFT JOIN events e ON e.venue_id = v.id ${dateFilter ? `AND ${dateFilter.replace('WHERE', '')}` : ''}
     LEFT JOIN registrations r ON r.event_id = e.id AND r.status != 'cancelled'
     GROUP BY v.id, v.name, v.capacity
     ORDER BY events_held DESC`,
    params
  );

  res.json(rows);
});

// Export CSV report
router.get("/export/:type", requireAuth(["admin", "eventManager"]), async (req, res) => {
  const { type } = req.params;
  const { startDate, endDate } = req.query;
  
  let dateFilter = "";
  let params = [];
  
  if (startDate && endDate) {
    dateFilter = "WHERE e.date >= $1 AND e.date <= $2";
    params = [startDate, endDate];
  }

  let query = "";
  let headers = [];

  switch (type) {
    case "events":
      query = `SELECT e.title, c.name as college, v.name as venue, e.date, e.status, u.email as requester
               FROM events e
               LEFT JOIN colleges c ON c.id = e.college_id
               LEFT JOIN venues v ON v.id = e.venue_id
               LEFT JOIN users u ON u.id = e.requester_id
               ${dateFilter}
               ORDER BY e.date DESC`;
      headers = ["Title", "College", "Venue", "Date", "Status", "Requester"];
      break;
      
    case "registrations":
      query = `SELECT e.title, r.name, r.email, r.phone, r.status, e.date
               FROM registrations r
               JOIN events e ON e.id = r.event_id
               ${dateFilter}
               ORDER BY e.date DESC, r.name`;
      headers = ["Event", "Name", "Email", "Phone", "Status", "Event Date"];
      break;
      
    default:
      return res.status(400).json({ error: "Invalid report type" });
  }

  const { rows } = await query(query, params);
  
  const csv = [
    headers.join(","),
    ...rows.map(row => 
      headers.map(header => {
        const key = header.toLowerCase().replace(/\s+/g, '_');
        const value = row[key] || "";
        return `"${value}"`;
      }).join(",")
    )
  ].join("\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename=${type}-report-${new Date().toISOString().split('T')[0]}.csv`);
  res.send(csv);
});

export default router;
