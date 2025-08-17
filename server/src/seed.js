import { pgPool } from './db.js';

async function seedDatabase() {
  if (!pgPool) {
    console.log('❌ No PostgreSQL connection available. Skipping seeding.');
    return;
  }

  try {
    console.log('🌱 Starting database seeding...');

    // Check if data already exists
    const existingUsers = await pgPool.query('SELECT COUNT(*) FROM users');
    if (parseInt(existingUsers.rows[0].count) > 0) {
      console.log('✅ Database already has data, skipping seeding.');
      return;
    }

    // Insert sample colleges
    console.log('📚 Inserting colleges...');
    const colleges = [
      'Virginia Community College System',
      'Northern Virginia Community College',
      'Virginia Western Community College',
      'Tidewater Community College',
      'Piedmont Virginia Community College'
    ];

    for (const college of colleges) {
      await pgPool.query('INSERT INTO colleges (name) VALUES ($1)', [college]);
    }

    // Insert sample venues
    console.log('🏢 Inserting venues...');
    const venues = [
      ['Main Auditorium', 500, 'Large auditorium for major events', 'Building A, Floor 1', 100.00],
      ['Conference Room 101', 50, 'Medium conference room', 'Building B, Floor 1', 25.00],
      ['VCCS Conference Center', 300, 'State-of-the-art conference facility', 'Richmond Main Campus', 75.00],
      ['VCCS Auditorium', 200, 'Professional theater space', 'VCCS Arts Complex', 60.00],
      ['VCCS Executive Boardroom', 30, 'Executive meeting room', 'VCCS Administration Building', 40.00]
    ];

    for (const [name, capacity, description, location, hourly_rate] of venues) {
      await pgPool.query(
        'INSERT INTO venues (name, capacity, description, location, hourly_rate, is_active) VALUES ($1, $2, $3, $4, $5, $6)',
        [name, capacity, description, location, hourly_rate, true]
      );
    }

    // Insert sample users (passwords will be hashed by setup-admin)
    console.log('👥 Inserting users...');
    const users = [
      ['admin@vccs.edu', 'VCCS System Administrator', 'admin'],
      ['manager@vccs.edu', 'VCCS Event Manager', 'eventManager'],
      ['student@vccs.edu', 'VCCS Student', 'student']
    ];

    for (const [email, name, role] of users) {
      await pgPool.query(
        'INSERT INTO users (email, name, role) VALUES ($1, $2, $3)',
        [email, name, role]
      );
    }

    // Insert sample events
    console.log('📅 Inserting events...');
    const events = [
      ['VCCS Fall Open House', 'Annual open house showcasing all VCCS colleges and programs.', 1, 1, '2025-09-15', '10:00:00', '16:00:00', 500, 'Approved'],
      ['VCCS Leadership Summit', 'Professional development conference for VCCS faculty and staff.', 4, 3, '2025-10-05', '08:30:00', '17:00:00', 100, 'Approved'],
      ['VCCS Student Success Conference', 'Conference focused on student retention and academic success.', 2, 2, '2025-11-12', '09:00:00', '15:00:00', 300, 'Approved']
    ];

    for (const [title, description, college_id, venue_id, date, start_time, end_time, max_capacity, status] of events) {
      await pgPool.query(
        `INSERT INTO events (title, description, college_id, venue_id, date, start_time, end_time, max_capacity, status, requester_id) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [title, description, college_id, venue_id, date, start_time, end_time, max_capacity, status, 1]
      );
    }

    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log('Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

export { seedDatabase };
