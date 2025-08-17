import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database configuration
const USE_POSTGRES = process.env.USE_POSTGRES === 'true' || process.env.DATABASE_URL;
const DATABASE_URL = process.env.DATABASE_URL;

// In-memory database (fallback)
let db = {
  users: [],
  events: [],
  venues: [],
  registrations: [],
  documents: [],
  invoices: [],
  colleges: [],
  migration_logs: []
};

// Database file path
const DB_FILE = path.join(__dirname, '../data/database.json');

// Ensure data directory exists
const dataDir = path.dirname(DB_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// PostgreSQL connection pool
let pgPool = null;

// Initialize PostgreSQL connection
async function initPostgreSQL() {
  if (!DATABASE_URL) {
    console.log('No DATABASE_URL provided, using in-memory database');
    return false;
  }

  try {
    pgPool = new pg.Pool({
      connectionString: DATABASE_URL,
      ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false,
    });

    // Test connection
    await pgPool.query('SELECT NOW()');
    console.log('✅ Connected to PostgreSQL database');
    return true;
  } catch (error) {
    console.log('❌ PostgreSQL connection failed, falling back to in-memory database:', error.message);
    return false;
  }
}

// Load database from file (in-memory fallback)
export function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      db = JSON.parse(data);
    }
  } catch (error) {
    console.log('No existing database found, starting fresh');
  }
}

// Save database to file (in-memory fallback)
export function saveDatabase() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  } catch (error) {
    console.error('Error saving database:', error);
  }
}

// Unified query function that works with both PostgreSQL and in-memory
export async function query(operation, table, data = null) {
  // Try PostgreSQL first if available
  if (pgPool) {
    try {
      return await postgresQuery(operation, table, data);
    } catch (error) {
      console.error('PostgreSQL query failed, falling back to in-memory:', error.message);
      // Fall back to in-memory
    }
  }

  // Use in-memory database
  return inMemoryQuery(operation, table, data);
}

// PostgreSQL query implementation
async function postgresQuery(operation, table, data) {
  switch (operation) {
    case 'SELECT':
      const result = await pgPool.query(`SELECT * FROM ${table}`);
      return { rows: result.rows };
    
    case 'INSERT':
      const columns = Object.keys(data).join(', ');
      const values = Object.values(data);
      const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
      
      const insertQuery = `
        INSERT INTO ${table} (${columns}) 
        VALUES (${placeholders}) 
        RETURNING *
      `;
      
      const insertResult = await pgPool.query(insertQuery, values);
      return { rows: insertResult.rows };
    
    case 'UPDATE':
      const updateColumns = Object.keys(data).filter(key => key !== 'id');
      const updateValues = updateColumns.map(key => data[key]);
      const updatePlaceholders = updateColumns.map((_, i) => `${updateColumns[i]} = $${i + 1}`);
      
      const updateQuery = `
        UPDATE ${table} 
        SET ${updatePlaceholders.join(', ')}, updated_at = NOW() 
        WHERE id = $${updateValues.length + 1} 
        RETURNING *
      `;
      
      const updateResult = await pgPool.query(updateQuery, [...updateValues, data.id]);
      return { rows: updateResult.rows };
    
    case 'DELETE':
      const deleteResult = await pgPool.query(`DELETE FROM ${table} WHERE id = $1 RETURNING *`, [data.id]);
      return { rows: deleteResult.rows };
    
    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
}

// In-memory query implementation
function inMemoryQuery(operation, table, data) {
  switch (operation) {
    case 'SELECT':
      return { rows: db[table] || [] };
    
    case 'INSERT':
      const newId = db[table].length + 1;
      const newRecord = { id: newId, ...data, created_at: new Date().toISOString() };
      db[table].push(newRecord);
      saveDatabase();
      return { rows: [newRecord] };
    
    case 'UPDATE':
      const index = db[table].findIndex(item => item.id === data.id);
      if (index !== -1) {
        db[table][index] = { ...db[table][index], ...data, updated_at: new Date().toISOString() };
        saveDatabase();
        return { rows: [db[table][index]] };
      }
      return { rows: [] };
    
    case 'DELETE':
      const deleteIndex = db[table].findIndex(item => item.id === data.id);
      if (deleteIndex !== -1) {
        const deleted = db[table].splice(deleteIndex, 1)[0];
        saveDatabase();
        return { rows: [deleted] };
      }
      return { rows: [] };
    
    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
}

// Initialize database with sample data
export async function initializeDatabase() {
  // Try to initialize PostgreSQL first
  const postgresAvailable = await initPostgreSQL();
  
  if (!postgresAvailable) {
    // Fall back to in-memory
    loadDatabase();
    
    // Add sample colleges if none exist
    if (db.colleges.length === 0) {
      db.colleges = [
        { id: 1, name: 'Virginia Community College System', created_at: new Date().toISOString() },
        { id: 2, name: 'Northern Virginia Community College', created_at: new Date().toISOString() },
        { id: 3, name: 'Virginia Western Community College', created_at: new Date().toISOString() }
      ];
    }

    // Add sample venues if none exist
    if (db.venues.length === 0) {
      db.venues = [
        { 
          id: 1, 
          name: 'Main Auditorium', 
          capacity: 500, 
          description: 'Large auditorium for major events',
          location: 'Building A, Floor 1',
          amenities: ['Projector', 'Sound System', 'Stage'],
          hourly_rate: 100.00,
          is_active: true,
          created_at: new Date().toISOString()
        },
        { 
          id: 2, 
          name: 'Conference Room 101', 
          capacity: 50, 
          description: 'Medium conference room',
          location: 'Building B, Floor 1',
          amenities: ['Projector', 'Whiteboard'],
          hourly_rate: 25.00,
          is_active: true,
          created_at: new Date().toISOString()
        }
      ];
    }

    saveDatabase();
  }
}

// Export PostgreSQL pool for direct access if needed
export { pgPool };

// Initialize on import
initializeDatabase();
