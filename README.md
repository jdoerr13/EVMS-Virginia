# EVMS-Virginia (Event and Venue Management System)

A comprehensive full-stack platform designed to streamline scheduling, approvals, and oversight for institutional events and facility bookings in Virginia institutions.

## 🚀 **Current Status: FULLY OPERATIONAL**

✅ **Backend API**: Complete and tested  
✅ **Database**: PostgreSQL schema implemented with sample data  
✅ **Authentication**: JWT-based system working with mock fallback  
✅ **All Endpoints**: Fully functional and documented  
✅ **Frontend**: React application fully integrated  
✅ **Role-Based Routing**: Admin/Event Manager/Public access working  
✅ **Event Management**: CRUD operations with remove functionality  
✅ **Security**: Vulnerabilities addressed and dependencies updated  

**Last Updated**: August 2024  
**Version**: v1.5.0 - Production Ready with Enhanced Features

## 🏗️ System Architecture

This project consists of two main components:

- **Frontend**: React-based web application with modern UI
- **Backend**: Node.js/Express API with PostgreSQL database

## 📁 Project Structure

```
EVMS-Virginia/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Main application pages
│   │   ├── contexts/      # React context providers
│   │   └── utils/         # Utility functions
│   └── package.json
├── server/                 # Node.js Backend
│   ├── src/
│   │   ├── routes/        # API route handlers
│   │   ├── middleware/    # Express middleware
│   │   └── db.js         # Database connection
│   ├── db/
│   │   └── schema.sql    # Database schema
│   └── package.json
└── README.md
```

## 🆕 **Recent Updates & Features**

### ✅ **Latest Fixes (August 2024)**
- **Authentication Flow**: Fixed admin portal redirecting to public calendar
- **Mock Authentication**: Added fallback authentication for development without backend
- **Role-Based Routing**: Implemented smart routing based on user roles
- **Remove Button**: Added ability to delete events (including approved ones)
- **Security**: Resolved npm vulnerabilities and updated dependencies
- **JSX Syntax**: Fixed compilation errors in EventManager and PublicView components

### 🎯 **Key Features**
- **Admin Dashboard**: Full event management with approval/rejection workflow
- **Event Manager Dashboard**: Event creation, management, and conflict detection
- **Public Calendar**: Event browsing and registration for students
- **Remove Functionality**: Delete events with confirmation dialog
- **Role-Based Access**: Different interfaces for admin, event manager, and public users

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **PostgreSQL** (v12 or higher)
- **npm** or **yarn**

### 1. Backend Setup

#### Install Dependencies
```bash
cd server
npm install
```

#### Environment Configuration
Create a `.env` file in the `server` directory:

```env
# Environment Configuration for EVMS Backend

# Database Configuration
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/evms_db
DATABASE_SSL=false

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here_change_this_in_production

# Server Configuration
PORT=4000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

#### PostgreSQL Installation & Setup

**Option A: Download PostgreSQL**
1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. Install with default settings
3. Remember the password you set for the `postgres` user
4. Update the `.env` file with your actual password

**Option B: Using PowerShell (if PostgreSQL is already installed)**
```powershell
# Add PostgreSQL to PATH (adjust version number as needed)
$env:PATH += ";C:\Program Files\PostgreSQL\17\bin"

# Test PostgreSQL connection
psql --version

# Create database (replace 'your_password' with actual password)
$env:PGPASSWORD = "your_password"
psql -U postgres -c "CREATE DATABASE evms_db;"
```

#### Database Migration & Admin Setup
Run the database migration and admin setup:

```bash
# Using PowerShell with password
$env:PGPASSWORD = "your_password"
psql -U postgres -d evms_db -f db/schema.sql

# Or using npm script (if configured correctly)
npm run migrate

# Setup admin system with demo users and VCCS data
npm run setup-admin
```

#### Start the Backend Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start

# Or start directly with Node.js
node src/server.js
```

The API will be available at `http://localhost:4000/api`

#### Verify Backend Setup
Test that your backend is working:

```bash
# Test the colleges endpoint
curl http://localhost:4000/api/colleges

# Or using PowerShell
Invoke-RestMethod -Uri "http://localhost:4000/api/colleges" -Method GET
```

You should see sample college data returned.

#### Troubleshooting

**Common Issues:**

1. **"Cannot find package 'express'"**
   ```bash
   cd server
   npm install
   ```

2. **PostgreSQL connection failed**
   - Ensure PostgreSQL is installed and running
   - Check your password in the `.env` file
   - Verify PostgreSQL service is started

3. **Port 4000 already in use**
   ```bash
   # Find and kill the process using port 4000
   netstat -ano | findstr :4000
   taskkill /PID <PID> /F
   ```

4. **Database migration fails**
   ```bash
   # Ensure you're using the correct password
   $env:PGPASSWORD = "your_actual_password"
   psql -U postgres -d evms_db -f db/schema.sql
   ```

### 2. Frontend Setup

#### Install Dependencies
```bash
cd client
npm install
```

#### Start the Frontend Development Server
```bash
npm start
```

The application will be available at `http://localhost:3000`

### 🎭 **Demo Credentials**

For testing the application, use these demo accounts:

**Admin User:**
- Email: `admin@vccs.edu`
- Password: `admin123`
- Access: Full admin dashboard with event approval/rejection

**Event Manager:**
- Email: `manager@vccs.edu`
- Password: `manager123`
- Access: Event creation and management dashboard

**Student/Public:**
- Email: `student@vccs.edu`
- Password: `student123`
- Access: Public calendar and event registration

### 🚀 **Quick Test**

1. Start both servers (backend on port 4000, frontend on port 3000)
2. Go to `http://localhost:3000`
3. Login with any of the demo credentials above
4. Test the different dashboards and features

## 🔧 Backend API Documentation

### Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

### Key Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/refresh-token` - Refresh JWT token

#### Events
- `GET /api/events` - List events with filters
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `POST /api/events/:id/hold` - Mark event as tentative
- `PATCH /api/events/:id/status` - Update event status

#### Venues
- `GET /api/venues` - List venues
- `POST /api/venues` - Create new venue
- `GET /api/venues/:id/availability` - Check venue availability

#### Documents
- `POST /api/events/:eventId/docs` - Upload document
- `GET /api/events/:eventId/docs` - Get event documents
- `DELETE /api/docs/:id` - Delete document

#### Invoices & Payments
- `POST /api/invoices` - Create invoice
- `POST /api/invoices/:id/pay` - Process payment (mock Stripe)
- `POST /api/invoices/refund/:id` - Process refund

#### Data Migration
- `POST /api/migration/upload` - Upload CSV/XLSX files
- `GET /api/migration/logs` - View migration logs

For complete API documentation, see [server/API_DOCUMENTATION.md](server/API_DOCUMENTATION.md)

## 👥 User Roles

### Admin
- Full system access
- User management
- Event approval/rejection
- System configuration
- Data migration

### Event Manager
- Create and manage events
- Upload documents
- Process registrations
- Generate invoices
- View reports

### Student
- View public events
- Register for events
- View personal registrations

## 🛠️ Features

### ✅ **Fully Implemented & Tested**

#### Backend API (Complete)
- ✅ **Authentication System** - JWT-based login, registration, profile management
- ✅ **Event Management** - Full CRUD operations, search, filtering, status management
- ✅ **Venue Management** - Venue CRUD, availability checks, statistics
- ✅ **User Management** - Role-based access control (Admin, EventManager, Student)
- ✅ **Registration System** - Event registration, capacity management, statistics
- ✅ **Document Management** - File uploads (PDF, Word, Excel, images) with multer
- ✅ **Invoice & Payment System** - Invoice generation, mock Stripe payments, refunds
- ✅ **Reporting & Analytics** - Comprehensive reports, CSV exports, statistics
- ✅ **Data Migration** - CSV/XLSX uploads, batch processing, logging
- ✅ **Database Schema** - Complete PostgreSQL schema with relationships and indexes

#### Frontend (Existing)
- ✅ **React Application** - Modern UI with Tailwind CSS
- ✅ **Role-based Dashboard** - Admin, EventManager, and Student views
- ✅ **Event Management** - Create, edit, view events
- ✅ **Registration System** - Event registration interface
- ✅ **Analytics & Charts** - Data visualization with Chart.js and Recharts
- ✅ **File Management** - Document upload and management
- ✅ **QR Code Generation** - Event QR codes for check-in
- ✅ **CSV Import/Export** - Data import and export functionality

### Event Management
- ✅ Event creation and scheduling
- ✅ Venue booking and availability
- ✅ Approval workflow system
- ✅ Conflict detection
- ✅ Event status tracking

### User Management
- ✅ Role-based access control
- ✅ JWT authentication
- ✅ User registration and profiles
- ✅ Password security

### Registration System
- ✅ Event registration
- ✅ Capacity management
- ✅ Dietary restrictions
- ✅ Special accommodations

### Document Management
- ✅ File uploads (PDF, Word, Excel, images)
- ✅ Document organization by event
- ✅ Secure file storage

### Financial Management
- ✅ Invoice generation
- ✅ Payment processing (mock Stripe)
- ✅ Refund handling
- ✅ Financial reporting

### Reporting & Analytics
- ✅ Event statistics
- ✅ Registration analytics
- ✅ Venue utilization reports
- ✅ CSV export functionality

### Data Migration
- ✅ CSV/XLSX file uploads
- ✅ Batch data processing
- ✅ Migration logging
- ✅ Error handling and retry

## 🗄️ Database Schema

The system uses PostgreSQL with the following main tables:

- **users** - User accounts and authentication
- **events** - Event information and scheduling
- **venues** - Venue details and availability
- **registrations** - Event registrations
- **documents** - File uploads and metadata
- **invoices** - Billing and payment records
- **migration_logs** - Data migration tracking

## 🔒 Security Features

- **JWT Authentication** with refresh tokens
- **Role-based Access Control** (RBAC)
- **Input Validation** using Zod schemas
- **SQL Injection Protection** with parameterized queries
- **CORS Configuration** for cross-origin requests
- **Helmet.js** security headers
- **Password Hashing** with bcrypt

## 📊 API Response Format

### Success Response
```json
{
  "id": 1,
  "title": "Event Title",
  "status": "success"
}
```

### Error Response
```json
{
  "error": "Error message description"
}
```

## 🚀 Deployment

### Backend Deployment

1. **Environment Setup**
   ```bash
   # Set production environment variables
   NODE_ENV=production
   DATABASE_URL=your_production_db_url
   JWT_SECRET=your_production_jwt_secret
   ```

2. **Database Migration**
   ```bash
   npm run migrate
   ```

3. **Start Production Server**
   ```bash
   npm start
   ```

### Frontend Deployment

1. **Build for Production**
   ```bash
   npm run build
   ```

2. **Deploy the `build` folder** to your web server

## 🧪 Testing

### Backend Testing
```bash
cd server
npm test
```

### Frontend Testing
```bash
cd client
npm test
```

## 📝 Development

### Backend Development
- **Hot Reload**: `npm run dev`
- **Database Reset**: `npm run migrate`
- **Seed Data**: `npm run seed`

### Frontend Development
- **Hot Reload**: `npm start`
- **Build**: `npm run build`
- **Lint**: `npm run lint`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the [API Documentation](server/API_DOCUMENTATION.md)
- Review the database schema in `db/schema.sql`
- Open an issue on GitHub

## 🔄 Version History

- **v1.0.0** - Initial release with core event management features
- **v1.1.0** - Added document management and file uploads
- **v1.2.0** - Implemented invoice and payment system
- **v1.3.0** - Added data migration capabilities
- **v1.4.0** - Enhanced reporting and analytics

---

**EVMS-Virginia** - Streamlining event management for Virginia institutions since 2024.
