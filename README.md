# EVMS-Virginia (Event and Venue Management System)

A comprehensive full-stack platform designed to streamline scheduling, approvals, and oversight for institutional events and facility bookings in Virginia institutions.

## 🚀 **Current Status: FULLY OPERATIONAL**

✅ **Backend API**: Complete and tested with Node.js/Express  
✅ **Database**: PostgreSQL with Docker support + In-memory fallback  
✅ **Authentication**: JWT-based system working  
✅ **All Endpoints**: Fully functional and documented  
✅ **Frontend**: React application fully integrated  
✅ **Role-Based Routing**: Admin/Event Manager/Public access working  
✅ **Event Management**: CRUD operations with remove functionality  
✅ **Security**: Vulnerabilities addressed and dependencies updated  
✅ **Docker Support**: Easy PostgreSQL setup with Docker Compose

**Last Updated**: August 2024  
**Version**: v2.1.0 - Node.js/Express with PostgreSQL & Docker Support

## 🏗️ System Architecture

This project consists of three main components:

- **Frontend**: React-based web application with modern UI
- **Backend**: Node.js/Express API with PostgreSQL database
- **Database**: PostgreSQL with Docker support (in-memory fallback available)

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
│   │   └── db.js         # Database layer (PostgreSQL + fallback)
│   ├── data/
│   │   └── database.json # JSON file storage (fallback)
│   ├── .env.example      # Environment configuration template
│   └── package.json
├── db/
│   └── schema.sql        # PostgreSQL database schema
├── docker-compose.yml    # Docker setup for PostgreSQL
├── start-dev.ps1        # Development startup script
└── README.md
```

## 🆕 **Recent Updates & Features**

### ✅ **Latest Changes (August 2024)**
- **PostgreSQL Integration**: Full PostgreSQL support with Docker setup
- **Docker Support**: Easy database setup with docker-compose
- **Development Script**: Automated startup script for full environment
- **Database Fallback**: Automatic fallback to in-memory database if PostgreSQL unavailable
- **Environment Configuration**: Proper .env setup with examples
- **Authentication Flow**: Fixed admin portal redirecting to public calendar
- **Role-Based Routing**: Implemented smart routing based on user roles
- **Remove Button**: Added ability to delete events (including approved ones)
- **Security**: Resolved npm vulnerabilities and updated dependencies

### 🎯 **Key Features**
- **Admin Dashboard**: Full event management with approval/rejection workflow
- **Event Manager Dashboard**: Event creation, management, and conflict detection
- **Public Calendar**: Event browsing and registration for students
- **Remove Functionality**: Delete events with confirmation dialog
- **Role-Based Access**: Different interfaces for admin, event manager, and public users
- **PostgreSQL Database**: Robust data persistence with Docker support

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Docker Desktop** (for PostgreSQL setup)

### Option 1: Full Setup with PostgreSQL (Recommended)

#### 1. Start PostgreSQL with Docker
```bash
# Start Docker Desktop first, then run:
docker-compose up -d
```

This will:
- Start PostgreSQL on port 5432
- Create database `evms_db`
- Run the schema migration automatically
- Set up admin user

#### 2. Backend Setup
```bash
cd server
npm install
```

#### 3. Environment Configuration
Copy the example environment file:
```bash
cp .env.example .env
```

The `.env` file is already configured for PostgreSQL:
```env
# Database Configuration
DATABASE_URL=postgresql://postgres:evms_password@localhost:5432/evms_db
USE_POSTGRES=true
DATABASE_SSL=false

# Server Configuration
PORT=4000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=evms_jwt_secret_key_change_this_in_production

# File Upload Configuration
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

#### 4. Start the Backend Server
```bash
npm run dev
```

### Option 2: In-Memory Database (No Docker Required)

If you prefer not to use Docker, the system will automatically fall back to an in-memory database:

```bash
cd server
npm install
npm run dev
```

The system will automatically detect that PostgreSQL is not available and use the in-memory database instead.

### 3. Frontend Setup

#### Install Dependencies
```bash
cd client
npm install
```

#### Start the Frontend Development Server
```bash
npm start
```

### 🚀 **One-Click Development Setup**

Use the provided startup script to launch everything at once:

```bash
# Make sure Docker Desktop is running first
.\start-dev.ps1
```

This script will:
1. Check if Docker is running
2. Start PostgreSQL container
3. Start the backend server
4. Start the frontend server
5. Open both applications in your browser

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

## 🗄️ Database Options

### PostgreSQL (Recommended)
- **Pros**: Robust, scalable, ACID compliance
- **Setup**: Docker Compose (easiest) or local installation
- **Data Persistence**: Full database with proper relationships
- **Performance**: Optimized queries and indexing

### In-Memory Database (Fallback)
- **Pros**: No setup required, instant startup
- **Cons**: Data lost on restart, limited scalability
- **Use Case**: Development, testing, demos
- **Storage**: JSON file in `server/data/database.json`

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
- ✅ **Database Layer** - PostgreSQL with automatic in-memory fallback

#### Frontend (Complete)
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

## 🗄️ Database Architecture

### PostgreSQL Schema
The system uses a comprehensive PostgreSQL schema with the following tables:

- **users** - User accounts and authentication
- **colleges** - Virginia community colleges
- **venues** - Event venues and facilities
- **events** - Event information and scheduling
- **registrations** - Event registrations and attendance
- **documents** - File uploads and document management
- **invoices** - Financial records and payments
- **invoice_items** - Detailed invoice line items
- **payments** - Payment transaction records
- **refunds** - Refund transaction records
- **migration_logs** - Data migration tracking

### In-Memory Fallback
If PostgreSQL is not available, the system automatically falls back to:
- **Storage**: `server/data/database.json`
- **Tables**: Same structure as PostgreSQL
- **Persistence**: Automatic saving to JSON file

## 🔒 Security Features

- **JWT Authentication** with refresh tokens
- **Role-based Access Control** (RBAC)
- **Input Validation** using Zod schemas
- **CORS Configuration** for cross-origin requests
- **Helmet.js** security headers
- **Password Hashing** with bcrypt
- **SQL Injection Protection** with parameterized queries

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
   JWT_SECRET=your_production_jwt_secret
   DATABASE_URL=your_production_postgres_url
   ```

2. **Start Production Server**
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
- **Setup Admin**: `npm run setup-admin`

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
- Review the database structure in `db/schema.sql`
- Open an issue on GitHub

## 🔄 Version History

- **v1.0.0** - Initial release with PostgreSQL backend
- **v1.1.0** - Added document management and file uploads
- **v1.2.0** - Implemented invoice and payment system
- **v1.3.0** - Added data migration capabilities
- **v1.4.0** - Enhanced reporting and analytics
- **v2.0.0** - Converted to Node.js/Express-only with in-memory database
- **v2.1.0** - **Added PostgreSQL support with Docker and development automation**

---

**EVMS-Virginia** - Streamlining event management for Virginia institutions since 2024.
