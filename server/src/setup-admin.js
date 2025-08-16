import bcrypt from 'bcrypt';
import { query } from './db.js';

async function setupAdminSystem() {
  try {
    console.log('🚀 Setting up VCCS Admin System...\n');

    // 1. Create demo users with proper password hashes
    console.log('📝 Creating demo users...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    const managerPassword = await bcrypt.hash('manager123', 10);
    const studentPassword = await bcrypt.hash('student123', 10);
    
    // Check if users already exist
    const existingUsers = await query('SELECT', 'users');
    const adminExists = existingUsers.rows.find(u => u.email === 'admin@vccs.edu');
    const managerExists = existingUsers.rows.find(u => u.email === 'manager@vccs.edu');
    const studentExists = existingUsers.rows.find(u => u.email === 'student@vccs.edu');
    
    if (!adminExists) {
      await query('INSERT', 'users', {
        email: 'admin@vccs.edu',
        password: adminPassword,
        name: 'VCCS System Administrator',
        role: 'admin'
      });
    }
    
    if (!managerExists) {
      await query('INSERT', 'users', {
        email: 'manager@vccs.edu',
        password: managerPassword,
        name: 'VCCS Event Manager',
        role: 'eventManager'
      });
    }
    
    if (!studentExists) {
      await query('INSERT', 'users', {
        email: 'student@vccs.edu',
        password: studentPassword,
        name: 'VCCS Student',
        role: 'student'
      });
    }
    
    console.log('✅ Demo users created successfully!');

    // 2. Ensure all VCCS colleges are present
    console.log('\n🏫 Setting up VCCS colleges...');
    const vccsColleges = [
      'Tidewater Community College',
      'Northern Virginia Community College',
      'Piedmont Virginia Community College',
      'Virginia Western Community College',
      'John Tyler Community College',
      'Reynolds Community College',
      'Central Virginia Community College',
      'Southside Virginia Community College',
      'Virginia Highlands Community College',
      'Mountain Empire Community College',
      'Patrick Henry Community College',
      'Danville Community College',
      'Germanna Community College',
      'Lord Fairfax Community College',
      'New River Community College',
      'Southwest Virginia Community College',
      'Wytheville Community College',
      'Eastern Shore Community College',
      'Paul D. Camp Community College',
      'Rappahannock Community College',
      'Blue Ridge Community College',
      'J. Sargeant Reynolds Community College',
      'Thomas Nelson Community College'
    ];

    const existingColleges = await query('SELECT', 'colleges');
    for (const college of vccsColleges) {
      const exists = existingColleges.rows.find(c => c.name === college);
      if (!exists) {
        await query('INSERT', 'colleges', { name: college });
      }
    }
    console.log('✅ VCCS colleges setup complete!');

    // 3. Ensure all VCCS venues are present
    console.log('\n🏢 Setting up VCCS venues...');
    const vccsVenues = [
      ['VCCS Conference Center', 500, 'State-of-the-art conference facility with multiple breakout rooms', 'Richmond Main Campus'],
      ['VCCS Auditorium', 300, 'Professional theater space for performances and presentations', 'VCCS Arts Complex'],
      ['VCCS Executive Boardroom', 50, 'Executive meeting room with advanced AV equipment', 'VCCS Administration Building'],
      ['VCCS Outdoor Pavilion', 1000, 'Open-air venue for large events and ceremonies', 'VCCS Campus Green'],
      ['VCCS Technology Lab', 200, 'Modern computer lab for technology demonstrations', 'VCCS Technology Center'],
      ['VCCS Student Center', 400, 'Multi-purpose student center for events and activities', 'VCCS Student Life Building'],
      ['VCCS Innovation Hub', 150, 'Collaborative space for innovation and entrepreneurship', 'VCCS Innovation Center'],
      ['VCCS Healthcare Simulation Lab', 100, 'Advanced healthcare training facility', 'VCCS Health Sciences Building'],
      ['VCCS Business Incubator', 75, 'Space for business development and networking', 'VCCS Business Center'],
      ['VCCS Cultural Arts Center', 600, 'Dedicated space for cultural events and performances', 'VCCS Arts District']
    ];

    const existingVenues = await query('SELECT', 'venues');
    for (const [name, capacity, description, location] of vccsVenues) {
      const exists = existingVenues.rows.find(v => v.name === name);
      if (!exists) {
        await query('INSERT', 'venues', {
          name,
          capacity,
          description,
          location,
          amenities: ['Projector', 'Sound System'],
          hourly_rate: 50.00,
          is_active: true
        });
      }
    }
    console.log('✅ VCCS venues setup complete!');

    // 4. Add sample VCCS events
    console.log('\n📅 Setting up VCCS events...');
    const vccsEvents = [
      ['VCCS Fall Open House', 'Annual open house showcasing all VCCS colleges and programs. Meet faculty, tour facilities, and learn about financial aid opportunities.', 1, 1, '2025-09-15', '10:00:00', '16:00:00', 500, 'Approved'],
      ['VCCS Leadership Summit', 'Professional development conference for VCCS faculty and staff. Workshops on leadership, innovation, and student success.', 4, 3, '2025-10-05', '08:30:00', '17:00:00', 100, 'Approved'],
      ['VCCS Student Success Conference', 'Conference focused on student retention, academic success, and career preparation across all VCCS institutions.', 2, 2, '2025-11-12', '09:00:00', '15:00:00', 300, 'Approved'],
      ['VCCS Technology Innovation Expo', 'Showcase of cutting-edge technology initiatives and digital learning tools across VCCS colleges.', 3, 5, '2025-10-22', '10:00:00', '18:00:00', 200, 'Approved'],
      ['VCCS Arts & Culture Festival', 'Celebration of artistic and cultural diversity across VCCS institutions. Performances, exhibits, and workshops.', 5, 4, '2025-11-08', '12:00:00', '20:00:00', 800, 'Approved']
    ];

    const existingEvents = await query('SELECT', 'events');
    for (const [title, description, collegeId, venueId, date, startTime, endTime, maxCapacity, status] of vccsEvents) {
      const exists = existingEvents.rows.find(e => e.title === title);
      if (!exists) {
        await query('INSERT', 'events', {
          title,
          description,
          college_id: collegeId,
          venue_id: venueId,
          date,
          start_time: startTime,
          end_time: endTime,
          max_capacity: maxCapacity,
          status,
          requester_id: 1
        });
      }
    }
    console.log('✅ VCCS events setup complete!');

    // 5. Add sample registrations
    console.log('\n👥 Setting up sample registrations...');
    const sampleRegistrations = [
      [1, 'Alex Johnson', 'alex.johnson@vccs.edu', '555-123-4567', 'Vegetarian', 'Wheelchair accessible seating'],
      [1, 'Maria Garcia', 'maria.garcia@vccs.edu', '555-234-5678', 'None', 'None'],
      [2, 'Sarah Lee', 'sarah.lee@vccs.edu', '555-345-6789', 'Gluten-free', 'None'],
      [3, 'David Kim', 'david.kim@vccs.edu', '555-456-7890', 'None', 'None'],
      [4, 'Emily Davis', 'emily.davis@vccs.edu', '555-567-8901', 'Vegan', 'None']
    ];

    const existingRegistrations = await query('SELECT', 'registrations');
    for (const [eventId, name, email, phone, dietary, accommodations] of sampleRegistrations) {
      const exists = existingRegistrations.rows.find(r => r.email === email && r.event_id === eventId);
      if (!exists) {
        await query('INSERT', 'registrations', {
          event_id: eventId,
          user_id: 4,
          name,
          email,
          phone,
          dietary_restrictions: dietary,
          special_accommodations: accommodations
        });
      }
    }
    console.log('✅ Sample registrations setup complete!');

    console.log('\n🎉 VCCS Admin System Setup Complete!');
    console.log('\n📋 Demo Credentials:');
    console.log('Admin: admin@vccs.edu / admin123');
    console.log('Manager: manager@vccs.edu / manager123');
    console.log('Student: student@vccs.edu / student123');
    console.log('\n🌐 Access the system at: http://localhost:3000');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

setupAdminSystem();
