// routes/auth.js
import express from "express";
import { query } from "../db.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("👉 Incoming login request:", email, password);

    const users = await query("SELECT * FROM users WHERE email=$1", [email]);
    console.log("👉 Query result:", users);

    const user = users[0];

    if (!user) {
      return res.status(401).json({ error: "No user found" });
    }

    if (user.password !== password) {
      console.log("👉 Password mismatch:", user.password, password);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error("👉 Login error:", err);
    res.status(500).json({ error: err.message });
  }
});


export default router;
