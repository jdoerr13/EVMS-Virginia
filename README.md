# EVMS-Virginia (Event and Venue Management System)

A comprehensive full-stack platform designed to streamline scheduling, approvals, and oversight for institutional events and facility bookings in Virginia institutions.

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
DATABASE_URL=postgresql://username:password@localhost:5432/evms_db
JWT_SECRET=your_super_secret_jwt_key_here
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here
CORS_ORIGIN=http://localhost:3000
PORT=4000
DATABASE_SSL=false
```

#### Database Setup
1. Create a PostgreSQL database:
```sql
CREATE DATABASE evms_db;
```

2. Run the database migration:
```bash
npm run migrate
```

#### Start the Backend Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:4000/api`

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
