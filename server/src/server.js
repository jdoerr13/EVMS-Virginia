import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/events.js";
import collegeRoutes from "./routes/colleges.js";
import venueRoutes from "./routes/venues.js";
import userRoutes from "./routes/users.js";
import registrationRoutes from "./routes/registrations.js";
import reportRoutes from "./routes/reports.js";
import documentRoutes from "./routes/documents.js";
import invoiceRoutes from "./routes/invoices.js";
import migrationRoutes from "./routes/migration.js";

dotenv.config();

const app = express();
app.use(helmet());
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") ?? true, credentials: true }));

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/colleges", collegeRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/users", userRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api", documentRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/migration", migrationRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API listening on :${port}`));
