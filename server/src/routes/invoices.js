import { Router } from "express";
import { query } from "../db.js";
import { z } from "zod";
import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

const createInvoiceSchema = z.object({
  body: z.object({
    eventId: z.number().int(),
    amount: z.number().positive(),
    description: z.string().min(1),
    dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    items: z.array(z.object({
      description: z.string(),
      quantity: z.number().int().positive(),
      unitPrice: z.number().positive()
    })).optional()
  })
});

const paymentSchema = z.object({
  body: z.object({
    paymentMethod: z.string().optional(),
    amount: z.number().positive().optional()
  })
});

// Create invoice
router.post("/", requireAuth(["admin", "eventManager"]), validate(createInvoiceSchema), async (req, res) => {
  const { eventId, amount, description, dueDate, items } = req.body;
  
  // Check if event exists
  const eventCheck = await query("SELECT id, title FROM events WHERE id = $1", [eventId]);
  if (eventCheck.rows.length === 0) {
    return res.status(404).json({ error: "Event not found" });
  }
  
  const event = eventCheck.rows[0];
  
  // Create invoice
  const { rows } = await query(
    `INSERT INTO invoices (event_id, amount, description, due_date, status, created_by)
     VALUES ($1, $2, $3, $4, 'pending', $5) RETURNING *`,
    [eventId, amount, description, dueDate || null, req.user.id]
  );
  
  const invoice = rows[0];
  
  // Add invoice items if provided
  if (items && items.length > 0) {
    for (const item of items) {
      await query(
        `INSERT INTO invoice_items (invoice_id, description, quantity, unit_price)
         VALUES ($1, $2, $3, $4)`,
        [invoice.id, item.description, item.quantity, item.unitPrice]
      );
    }
  }
  
  res.status(201).json({
    id: invoice.id,
    eventId: invoice.event_id,
    eventTitle: event.title,
    amount: invoice.amount,
    description: invoice.description,
    status: invoice.status,
    dueDate: invoice.due_date,
    createdAt: invoice.created_at
  });
});

// Get invoices for an event
router.get("/event/:eventId", requireAuth(["admin", "eventManager"]), async (req, res) => {
  const { eventId } = req.params;
  
  const { rows } = await query(
    `SELECT i.*, e.title as event_title, u.name as created_by_name
     FROM invoices i
     JOIN events e ON e.id = i.event_id
     LEFT JOIN users u ON u.id = i.created_by
     WHERE i.event_id = $1
     ORDER BY i.created_at DESC`,
    [eventId]
  );
  
  res.json(rows);
});

// Get all invoices (Admin only)
router.get("/", requireAuth(["admin"]), async (req, res) => {
  const { status, startDate, endDate } = req.query;
  
  let whereClause = "";
  let params = [];
  
  if (status) {
    whereClause = "WHERE i.status = $1";
    params.push(status);
  }
  
  if (startDate && endDate) {
    const dateFilter = "WHERE i.created_at >= $1 AND i.created_at <= $2";
    if (whereClause) {
      whereClause = whereClause.replace("WHERE", "AND");
      whereClause = `WHERE i.created_at >= $${params.length + 1} AND i.created_at <= $${params.length + 2} ${whereClause}`;
      params.push(startDate, endDate);
    } else {
      whereClause = dateFilter;
      params.push(startDate, endDate);
    }
  }
  
  const { rows } = await query(
    `SELECT i.*, e.title as event_title, u.name as created_by_name
     FROM invoices i
     JOIN events e ON e.id = i.event_id
     LEFT JOIN users u ON u.id = i.created_by
     ${whereClause}
     ORDER BY i.created_at DESC`,
    params
  );
  
  res.json(rows);
});

// Get invoice details with items
router.get("/:id", requireAuth(["admin", "eventManager"]), async (req, res) => {
  const { id } = req.params;
  
  // Get invoice
  const invoiceResult = await query(
    `SELECT i.*, e.title as event_title, u.name as created_by_name
     FROM invoices i
     JOIN events e ON e.id = i.event_id
     LEFT JOIN users u ON u.id = i.created_by
     WHERE i.id = $1`,
    [id]
  );
  
  if (invoiceResult.rows.length === 0) {
    return res.status(404).json({ error: "Invoice not found" });
  }
  
  const invoice = invoiceResult.rows[0];
  
  // Get invoice items
  const itemsResult = await query(
    "SELECT * FROM invoice_items WHERE invoice_id = $1 ORDER BY id",
    [id]
  );
  
  res.json({
    ...invoice,
    items: itemsResult.rows
  });
});

// Process payment (mock Stripe checkout)
router.post("/:id/pay", requireAuth(["admin", "eventManager"]), validate(paymentSchema), async (req, res) => {
  const { id } = req.params;
  const { paymentMethod, amount } = req.body;
  
  // Get invoice
  const { rows } = await query("SELECT * FROM invoices WHERE id = $1", [id]);
  if (rows.length === 0) {
    return res.status(404).json({ error: "Invoice not found" });
  }
  
  const invoice = rows[0];
  
  if (invoice.status === 'paid') {
    return res.status(400).json({ error: "Invoice is already paid" });
  }
  
  // Mock payment processing
  const paymentAmount = amount || invoice.amount;
  const paymentId = `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Update invoice status
  await query(
    `UPDATE invoices SET status = 'paid', paid_at = NOW(), payment_id = $1, payment_amount = $2
     WHERE id = $3`,
    [paymentId, paymentAmount, id]
  );
  
  // Create payment record
  await query(
    `INSERT INTO payments (invoice_id, amount, payment_method, payment_id, processed_by)
     VALUES ($1, $2, $3, $4, $5)`,
    [id, paymentAmount, paymentMethod || 'card', paymentId, req.user.id]
  );
  
  res.json({
    success: true,
    paymentId,
    amount: paymentAmount,
    message: "Payment processed successfully"
  });
});

// Process refund
router.post("/refund/:id", requireAuth(["admin"]), async (req, res) => {
  const { id } = req.params;
  const { amount, reason } = req.body;
  
  // Get invoice
  const { rows } = await query("SELECT * FROM invoices WHERE id = $1", [id]);
  if (rows.length === 0) {
    return res.status(404).json({ error: "Invoice not found" });
  }
  
  const invoice = rows[0];
  
  if (invoice.status !== 'paid') {
    return res.status(400).json({ error: "Invoice is not paid" });
  }
  
  const refundAmount = amount || invoice.payment_amount;
  const refundId = `re_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Update invoice status
  await query(
    `UPDATE invoices SET status = 'refunded', refunded_at = NOW(), refund_id = $1, refund_amount = $2
     WHERE id = $3`,
    [refundId, refundAmount, id]
  );
  
  // Create refund record
  await query(
    `INSERT INTO refunds (invoice_id, amount, reason, refund_id, processed_by)
     VALUES ($1, $2, $3, $4, $5)`,
    [id, refundAmount, reason || 'Customer request', refundId, req.user.id]
  );
  
  res.json({
    success: true,
    refundId,
    amount: refundAmount,
    message: "Refund processed successfully"
  });
});

// Get payment history for an invoice
router.get("/:id/payments", requireAuth(["admin", "eventManager"]), async (req, res) => {
  const { id } = req.params;
  
  const { rows } = await query(
    `SELECT p.*, u.name as processed_by_name
     FROM payments p
     LEFT JOIN users u ON u.id = p.processed_by
     WHERE p.invoice_id = $1
     ORDER BY p.created_at DESC`,
    [id]
  );
  
  res.json(rows);
});

// Get refund history for an invoice
router.get("/:id/refunds", requireAuth(["admin"]), async (req, res) => {
  const { id } = req.params;
  
  const { rows } = await query(
    `SELECT r.*, u.name as processed_by_name
     FROM refunds r
     LEFT JOIN users u ON u.id = r.processed_by
     WHERE r.invoice_id = $1
     ORDER BY r.created_at DESC`,
    [id]
  );
  
  res.json(rows);
});

export default router;
