import dotenv from "dotenv";
// ✅ Load env first, before anything else
dotenv.config({ path: "./.env" });

import express from "express";
import cors from "cors";
import { query } from "./db.js";   // now DATABASE_URL is set correctly

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// Routes
import authRoutes from "./routes/auth.js";
import collegesRoutes from "./routes/colleges.js";
import venuesRoutes from "./routes/venues.js";
import eventsRoutes from "./routes/events.js";
import usersRoutes from "./routes/users.js";
import registrationsRoutes from "./routes/registrations.js";

app.use("/auth", authRoutes);
app.use("/colleges", collegesRoutes);
app.use("/venues", venuesRoutes);
app.use("/events", eventsRoutes);
app.use("/users", usersRoutes);
app.use("/registrations", registrationsRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

// Start server + DB test
app.listen(PORT, async () => {
  console.log(`🚀 API running on http://localhost:${PORT}`);

  try {
    const result = await query("SELECT current_database(), current_user");
    console.log("✅ Connected to:", result[0]);
  } catch (err) {
    console.error("❌ Postgres connection failed:", err.message);
  }
});
