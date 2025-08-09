import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { query } from "./db.js";
dotenv.config();

async function run() {
  const hash = await bcrypt.hash("password123", 10);

  await query(
    `INSERT INTO users (email, password, role) VALUES
      ('admin@vccs.edu', $1, 'admin'),
      ('manager@vccs.edu', $1, 'eventManager'),
      ('viewer@vccs.edu', $1, 'public')
     ON CONFLICT (email) DO NOTHING`,
    [hash]
  );

  console.log("Seed complete");
  process.exit(0);
}
run().catch((e) => { console.error(e); process.exit(1); });
