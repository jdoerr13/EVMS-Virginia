-- EVMS Database Schema
-- Event and Venue Management System

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'eventManager', 'student')),
    college_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Colleges table
CREATE TABLE IF NOT EXISTS colleges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Venues table
CREATE TABLE IF NOT EXISTS venues (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    capacity INTEGER,
    description TEXT,
    location VARCHAR(255),
    amenities TEXT[],
    hourly_rate DECIMAL(10,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    college_id INTEGER REFERENCES colleges(id),
    venue_id INTEGER REFERENCES venues(id),
    date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    max_capacity INTEGER,
    status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Tentative')),
    requester_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Registrations table
CREATE TABLE IF NOT EXISTS registrations (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    dietary_restrictions TEXT,
    special_accommodations TEXT,
    status VARCHAR(50) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'waitlist')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    description TEXT,
    uploaded_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id),
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    due_date DATE,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled', 'refunded')),
    created_by INTEGER REFERENCES users(id),
    payment_id VARCHAR(255),
    payment_amount DECIMAL(10,2),
    paid_at TIMESTAMP,
    refund_id VARCHAR(255),
    refund_amount DECIMAL(10,2),
    refunded_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Invoice items table
CREATE TABLE IF NOT EXISTS invoice_items (
    id SERIAL PRIMARY KEY,
    invoice_id INTEGER REFERENCES invoices(id) ON DELETE CASCADE,
    description VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    invoice_id INTEGER REFERENCES invoices(id),
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50),
    payment_id VARCHAR(255),
    processed_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Refunds table
CREATE TABLE IF NOT EXISTS refunds (
    id SERIAL PRIMARY KEY,
    invoice_id INTEGER REFERENCES invoices(id),
    amount DECIMAL(10,2) NOT NULL,
    reason TEXT,
    refund_id VARCHAR(255),
    processed_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Migration logs table
CREATE TABLE IF NOT EXISTS migration_logs (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    migration_type VARCHAR(100),
    description TEXT,
    status VARCHAR(50) DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
    processed_rows INTEGER,
    result_message TEXT,
    retry_count INTEGER DEFAULT 0,
    uploaded_by INTEGER REFERENCES users(id),
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_venue ON events(venue_id);
CREATE INDEX IF NOT EXISTS idx_registrations_event ON registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_user ON registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_event ON invoices(event_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_documents_event ON documents(event_id);
CREATE INDEX IF NOT EXISTS idx_migration_logs_status ON migration_logs(status);

-- Sample data
INSERT INTO colleges (name) VALUES 
    ('Tidewater Community College'),
    ('Northern Virginia Community College'),
    ('Piedmont Virginia Community College'),
    ('Virginia Western Community College'),
    ('John Tyler Community College'),
    ('Reynolds Community College'),
    ('Central Virginia Community College'),
    ('Southside Virginia Community College'),
    ('Virginia Highlands Community College'),
    ('Mountain Empire Community College'),
    ('Patrick Henry Community College'),
    ('Danville Community College'),
    ('Germanna Community College'),
    ('Lord Fairfax Community College'),
    ('New River Community College'),
    ('Southwest Virginia Community College'),
    ('Wytheville Community College'),
    ('Eastern Shore Community College'),
    ('Paul D. Camp Community College'),
    ('Rappahannock Community College'),
    ('Blue Ridge Community College'),
    ('J. Sargeant Reynolds Community College'),
    ('Thomas Nelson Community College')
ON CONFLICT DO NOTHING;

INSERT INTO venues (name, capacity, description, location) VALUES 
    ('VCCS Conference Center', 500, 'State-of-the-art conference facility with multiple breakout rooms', 'Richmond Main Campus'),
    ('VCCS Auditorium', 300, 'Professional theater space for performances and presentations', 'VCCS Arts Complex'),
    ('VCCS Executive Boardroom', 50, 'Executive meeting room with advanced AV equipment', 'VCCS Administration Building'),
    ('VCCS Outdoor Pavilion', 1000, 'Open-air venue for large events and ceremonies', 'VCCS Campus Green'),
    ('VCCS Technology Lab', 200, 'Modern computer lab for technology demonstrations', 'VCCS Technology Center'),
    ('VCCS Student Center', 400, 'Multi-purpose student center for events and activities', 'VCCS Student Life Building'),
    ('VCCS Innovation Hub', 150, 'Collaborative space for innovation and entrepreneurship', 'VCCS Innovation Center'),
    ('VCCS Healthcare Simulation Lab', 100, 'Advanced healthcare training facility', 'VCCS Health Sciences Building'),
    ('VCCS Business Incubator', 75, 'Space for business development and networking', 'VCCS Business Center'),
    ('VCCS Cultural Arts Center', 600, 'Dedicated space for cultural events and performances', 'VCCS Arts District')
ON CONFLICT DO NOTHING;

-- Create admin user (password: admin123)
INSERT INTO users (email, password, name, role) VALUES 
    ('admin@vccs.edu', '$2b$10$rQZ8K9vX2mN3pL4qR5sT6uV7wX8yZ9aA0bB1cC2dE3fF4gG5hH6iI7jJ8kK9lL0mM1nN2oO3pP4qQ5rR6sS7tT8uU9vV0wW1xX2yY3zZ', 'VCCS System Administrator', 'admin')
ON CONFLICT DO NOTHING;

-- Add VCCS-specific events
INSERT INTO events (title, description, college_id, venue_id, date, start_time, end_time, max_capacity, status, requester_id) VALUES 
    ('VCCS Fall Open House', 'Annual open house showcasing all VCCS colleges and programs. Meet faculty, tour facilities, and learn about financial aid opportunities.', 1, 1, '2025-09-15', '10:00:00', '16:00:00', 500, 'Approved', 1),
    ('VCCS Leadership Summit', 'Professional development conference for VCCS faculty and staff. Workshops on leadership, innovation, and student success.', 4, 3, '2025-10-05', '08:30:00', '17:00:00', 100, 'Approved', 1),
    ('VCCS Student Success Conference', 'Conference focused on student retention, academic success, and career preparation across all VCCS institutions.', 2, 2, '2025-11-12', '09:00:00', '15:00:00', 300, 'Approved', 1),
    ('VCCS Technology Innovation Expo', 'Showcase of cutting-edge technology initiatives and digital learning tools across VCCS colleges.', 3, 5, '2025-10-22', '10:00:00', '18:00:00', 200, 'Approved', 1),
    ('VCCS Arts & Culture Festival', 'Celebration of artistic and cultural diversity across VCCS institutions. Performances, exhibits, and workshops.', 5, 4, '2025-11-08', '12:00:00', '20:00:00', 800, 'Approved', 1),
    ('VCCS Healthcare Career Fair', 'Career fair connecting students with healthcare employers and educational opportunities.', 2, 1, '2025-09-28', '09:00:00', '16:00:00', 400, 'Approved', 1),
    ('VCCS Business & Entrepreneurship Forum', 'Forum for business students and entrepreneurs to network with industry leaders and learn about opportunities.', 4, 3, '2025-10-15', '13:00:00', '18:00:00', 150, 'Approved', 1),
    ('VCCS Community Service Day', 'Day of service bringing together VCCS students, faculty, and staff to serve local communities.', 1, 4, '2025-09-20', '08:00:00', '14:00:00', 600, 'Approved', 1),
    ('VCCS Research Symposium', 'Annual symposium showcasing student and faculty research across all VCCS colleges.', 2, 5, '2025-11-05', '09:00:00', '17:00:00', 250, 'Approved', 1),
    ('VCCS Winter Graduation Ceremony', 'Celebration of student achievements and graduation ceremonies across VCCS institutions.', 1, 1, '2025-12-12', '14:00:00', '18:00:00', 1000, 'Approved', 1)
ON CONFLICT DO NOTHING;
