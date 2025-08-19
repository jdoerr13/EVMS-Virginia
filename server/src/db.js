import dotenv from "dotenv";
dotenv.config({ path: "./.env" });  // ✅ ensure env is loaded here

import pkg from "pg";
const { Pool } = pkg;

console.log("🌐 Using DATABASE_URL:", process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

export async function query(text, params) {
  const res = await pool.query(text, params);
  return res.rows;
}
