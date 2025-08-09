import { Router } from "express";
import { query } from "../db.js";

const router = Router();

router.get("/", async (_req, res) => {
  const { rows } = await query("SELECT id, name FROM colleges ORDER BY name");
  res.json(rows);
});

export default router;