import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory database
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

// Load database from file
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

// Save database to file
export function saveDatabase() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  } catch (error) {
    console.error('Error saving database:', error);
  }
}

// Database operations
export async function query(operation, table, data = null) {
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
export function initializeDatabase() {
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

// Initialize on import
initializeDatabase();
