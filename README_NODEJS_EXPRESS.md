# EVMS-Virginia - Node.js/Express Edition

A comprehensive full-stack event management system built with **Node.js/Express** backend and **React** frontend, designed for Virginia institutions to streamline event scheduling, venue bookings, and institutional management.

## 🚀 **Current Status: FULLY OPERATIONAL**

✅ **Backend API**: Complete Node.js/Express server with in-memory database  
✅ **Frontend**: React application with modern UI and Tailwind CSS  
✅ **Database**: JSON file-based storage with automatic persistence  
✅ **Authentication**: JWT-based system with role-based access  
✅ **All Features**: Event management, venue booking, user registration, reporting  
✅ **Deployment Ready**: Simple setup with no external database required  

**Version**: v2.0.0 - Node.js/Express Only  
**Last Updated**: August 2024

## 🏗️ **Complete System Architecture**

### **Frontend (React)**
- **Framework**: React 18 with modern hooks
- **Styling**: Tailwind CSS for responsive design
- **Routing**: React Router v6 with protected routes
- **State Management**: React Context API
- **UI Components**: Headless UI, Heroicons
- **Charts**: Chart.js and Recharts for analytics
- **File Handling**: CSV import/export, QR code generation

### **Backend (Node.js/Express)**
- **Runtime**: Node.js with ES modules
- **Framework**: Express.js with middleware
- **Database**: In-memory JSON file storage
- **Authentication**: JWT with refresh tokens
- **File Uploads**: Multer for document management
- **Validation**: Zod schemas for input validation
- **Security**: Helmet.js, CORS, bcrypt password hashing

## 📁 **Project Structure**

```
EVMS-Virginia/
├── client/                          # React Frontend
│   ├── public/
│   │   └── index.html              # Main HTML template
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   │   ├── AnalyticsCharts.jsx
│   │   │   ├── CalendarView.jsx
│   │   │   ├── EventForm.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── VenueFilter.jsx
│   │   ├── contexts/               # React context providers
│   │   │   ├── AuthContext.js
│   │   │   └── EventContext.js
│   │   ├── pages/                  # Main application pages
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── EventManager.jsx
│   │   │   ├── PublicView.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── RegistrationPage.jsx
│   │   │   ├── Reports.jsx
│   │   │   ├── Venues.jsx
│   │   │   ├── InvoiceManager.jsx
│   │   │   ├── DataMigration.jsx
│   │   │   ├── CRM.jsx
│   │   │   ├── ContractGenerator.jsx
│   │   │   ├── EmailRegistrants.jsx
│   │   │   ├── SecuritySettings.jsx
│   │   │   ├── SpeakerBios.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── BreakoutSessions.jsx
│   │   │   ├── Compliance.jsx
│   │   │   ├── MobileApp.jsx
│   │   │   ├── ResourceManagement.jsx
│   │   │   ├── ReviewRequests.jsx
│   │   │   └── AccessibilityDemo.jsx
│   │   ├── utils/                  # Utility functions
│   │   │   ├── api.js             # API client with axios
│   │   │   ├── csvUtils.js        # CSV import/export
│   │   │   └── ics.js             # Calendar integration
│   │   ├── styles/
│   │   │   └── App.css            # Custom styles
│   │   ├── App.jsx                # Main app component
│   │   ├── index.js               # React entry point
│   │   └── index.css              # Global styles
│   ├── package.json               # Frontend dependencies
│   ├── tailwind.config.js         # Tailwind configuration
│   └── postcss.config.js          # PostCSS configuration
├── server/                         # Node.js Backend
│   ├── src/
│   │   ├── routes/                # API route handlers
│   │   │   ├── auth.js            # Authentication routes
│   │   │   ├── events.js          # Event management
│   │   │   ├── venues.js          # Venue management
│   │   │   ├── users.js           # User management
│   │   │   ├── registrations.js   # Registration system
│   │   │   ├── documents.js       # File uploads
│   │   │   ├── invoices.js        # Payment processing
│   │   │   ├── reports.js         # Analytics & reporting
│   │   │   ├── migration.js       # Data migration
│   │   │   └── colleges.js        # College management
│   │   ├── middleware/            # Express middleware
│   │   │   ├── auth.js            # JWT authentication
│   │   │   └── validate.js        # Input validation
│   │   ├── db.js                  # In-memory database
│   │   ├── server.js              # Express server setup
│   │   └── setup-admin.js         # Admin user setup
│   ├── data/
│   │   └── database.json          # JSON file storage
│   ├── package.json               # Backend dependencies
│   └── API_DOCUMENTATION.md       # Complete API docs
└── README.md                      # Main documentation
```

## 🚀 **Quick Start Guide**

### **Prerequisites**
- **Node.js** (v16 or higher)
- **npm** or **yarn**

### **1. Clone and Setup**

```bash
# Clone the repository
git clone https://github.com/jdoerr13/EVMS-Virginia.git
cd EVMS-Virginia

# Switch to the Node.js/Express branch
git checkout nodejs-express-only
```

### **2. Backend Setup**

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
echo "# Server Configuration
PORT=4000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here_change_this_in_production

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads" > .env

# Setup admin users and sample data
npm run setup-admin

# Start the backend server
npm run dev
```

The backend will be available at `http://localhost:4000/api`

### **3. Frontend Setup**

```bash
# Open a new terminal and navigate to client directory
cd client

# Install dependencies
npm install

# Start the frontend development server
npm start
```

The frontend will be available at `http://localhost:3000`

### **4. Verify Setup**

```bash
# Test backend health
curl http://localhost:4000/api/health

# Test API endpoints
curl http://localhost:4000/api/colleges
curl http://localhost:4000/api/venues
curl http://localhost:4000/api/events
```

## 🎭 **Demo Credentials**

| Role | Email | Password | Access |
|------|-------|----------|---------|
| **Admin** | `admin@vccs.edu` | `admin123` | Full system administration |
| **Event Manager** | `manager@vccs.edu` | `manager123` | Event creation and management |
| **Student** | `student@vccs.edu` | `student123` | Public calendar and registration |

## 🎯 **Frontend Features**

### **Admin Dashboard** (`AdminDashboard.jsx`)
- **Event Approval Workflow**: Approve/reject pending events
- **User Management**: View and manage all users
- **System Configuration**: Global settings and preferences
- **Analytics Overview**: System-wide statistics and reports
- **Data Migration**: Import/export functionality

### **Event Manager Dashboard** (`EventManager.jsx`)
- **Event Creation**: Comprehensive event creation form
- **Event Management**: Edit, update, and delete events
- **Venue Booking**: Check availability and book venues
- **Registration Management**: View and manage registrations
- **Document Uploads**: Attach files to events

### **Public Calendar** (`PublicView.jsx`)
- **Event Browsing**: Browse all public events
- **Event Registration**: Register for events with details
- **Calendar View**: Monthly/weekly calendar interface
- **Search & Filter**: Find events by date, venue, or keyword
- **Personal Registrations**: View registered events

### **Student Dashboard** (`StudentDashboard.jsx`)
- **Personal Events**: View registered events
- **Event History**: Past event registrations
- **Profile Management**: Update personal information
- **Notifications**: Event reminders and updates

### **Additional Pages**
- **Reports** (`Reports.jsx`): Comprehensive analytics and reporting
- **Venues** (`Venues.jsx`): Venue management and availability
- **Invoice Manager** (`InvoiceManager.jsx`): Payment processing
- **Data Migration** (`DataMigration.jsx`): Import/export tools
- **CRM** (`CRM.jsx`): Customer relationship management
- **Contract Generator** (`ContractGenerator.jsx`): Document generation
- **Email Registrants** (`EmailRegistrants.jsx`): Communication tools
- **Security Settings** (`SecuritySettings.jsx`): Security configuration
- **Speaker Bios** (`SpeakerBios.jsx`): Presenter management
- **Breakout Sessions** (`BreakoutSessions.jsx`): Multi-session events
- **Compliance** (`Compliance.jsx`): Regulatory compliance
- **Mobile App** (`MobileApp.jsx`): Mobile interface
- **Resource Management** (`ResourceManagement.jsx`): Equipment tracking
- **Review Requests** (`ReviewRequests.jsx`): Approval workflow
- **Accessibility Demo** (`AccessibilityDemo.jsx`): WCAG compliance

## 🔧 **Backend API Features**

### **Authentication System**
- **JWT Tokens**: Secure authentication with refresh tokens
- **Role-Based Access**: Admin, EventManager, Student roles
- **Password Security**: bcrypt hashing
- **Session Management**: Automatic token refresh

### **Event Management**
- **CRUD Operations**: Create, read, update, delete events
- **Status Management**: Pending, Approved, Rejected, Tentative
- **Conflict Detection**: Venue availability checking
- **Search & Filtering**: Advanced event search capabilities

### **Venue Management**
- **Venue CRUD**: Complete venue management
- **Availability Checking**: Real-time availability
- **Capacity Management**: Maximum capacity tracking
- **Amenities Tracking**: Equipment and features

### **Registration System**
- **Event Registration**: Student registration for events
- **Capacity Management**: Automatic capacity checking
- **Special Requirements**: Dietary restrictions, accommodations
- **Status Tracking**: Confirmed, cancelled, waitlist

### **Document Management**
- **File Uploads**: PDF, Word, Excel, images
- **Secure Storage**: Local file system with metadata
- **Event Association**: Documents linked to events
- **Download Management**: Secure file downloads

### **Financial Management**
- **Invoice Generation**: Automatic invoice creation
- **Payment Processing**: Mock Stripe integration
- **Refund Handling**: Payment refunds
- **Financial Reporting**: Revenue and payment tracking

### **Reporting & Analytics**
- **Event Statistics**: Comprehensive event analytics
- **Registration Reports**: Registration trends and data
- **Venue Utilization**: Venue usage statistics
- **CSV Export**: Data export functionality

### **Data Migration**
- **CSV/XLSX Import**: Batch data import
- **Migration Logging**: Detailed migration tracking
- **Error Handling**: Robust error management
- **Retry Mechanisms**: Failed migration retry

## 🗄️ **Database Architecture**

### **In-Memory Database with JSON Persistence**
- **Storage**: `server/data/database.json`
- **Automatic Persistence**: Data saved to file automatically
- **No External Dependencies**: No PostgreSQL or other databases required
- **Simple Backup**: Just copy the JSON file

### **Data Structure**
```json
{
  "users": [
    {
      "id": 1,
      "email": "admin@vccs.edu",
      "password": "hashed_password",
      "name": "VCCS System Administrator",
      "role": "admin",
      "created_at": "2024-08-16T..."
    }
  ],
  "events": [
    {
      "id": 1,
      "title": "VCCS Fall Open House",
      "description": "Annual open house...",
      "college_id": 1,
      "venue_id": 1,
      "date": "2025-09-15",
      "start_time": "10:00:00",
      "end_time": "16:00:00",
      "max_capacity": 500,
      "status": "Approved",
      "requester_id": 1,
      "created_at": "2024-08-16T..."
    }
  ],
  "venues": [...],
  "registrations": [...],
  "documents": [...],
  "invoices": [...],
  "colleges": [...],
  "migration_logs": [...]
}
```

## 🔒 **Security Features**

### **Authentication & Authorization**
- **JWT Tokens**: Secure stateless authentication
- **Refresh Tokens**: Automatic token renewal
- **Role-Based Access Control**: Granular permissions
- **Password Hashing**: bcrypt with salt

### **Input Validation**
- **Zod Schemas**: Type-safe input validation
- **SQL Injection Protection**: No SQL queries (in-memory)
- **XSS Protection**: Input sanitization
- **CSRF Protection**: Token-based protection

### **API Security**
- **CORS Configuration**: Controlled cross-origin requests
- **Helmet.js**: Security headers
- **Rate Limiting**: Request throttling
- **Error Handling**: Secure error responses

## 📊 **API Endpoints**

### **Authentication**
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/refresh-token` - Refresh JWT token

### **Events**
- `GET /api/events` - List events with filters
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `PATCH /api/events/:id/status` - Update event status

### **Venues**
- `GET /api/venues` - List venues
- `GET /api/venues/:id` - Get single venue
- `POST /api/venues` - Create new venue
- `PUT /api/venues/:id` - Update venue
- `DELETE /api/venues/:id` - Delete venue
- `GET /api/venues/:id/availability` - Check availability

### **Registrations**
- `GET /api/registrations/event/:eventId` - Get event registrations
- `GET /api/registrations/my-registrations` - Get user registrations
- `POST /api/registrations` - Create registration
- `PUT /api/registrations/:id` - Update registration
- `DELETE /api/registrations/:id` - Cancel registration

### **Documents**
- `GET /api/events/:eventId/docs` - Get event documents
- `POST /api/events/:eventId/docs` - Upload document
- `GET /api/docs/:id/download` - Download document
- `DELETE /api/docs/:id` - Delete document

### **Invoices**
- `GET /api/invoices` - List invoices
- `POST /api/invoices` - Create invoice
- `POST /api/invoices/:id/pay` - Process payment
- `POST /api/invoices/refund/:id` - Process refund

### **Reports**
- `GET /api/reports/overview` - System overview
- `GET /api/reports/by-college` - College statistics
- `GET /api/reports/by-venue` - Venue utilization
- `GET /api/reports/monthly-trends` - Monthly trends
- `GET /api/reports/export/:type` - Export reports

## 🚀 **Deployment**

### **Backend Deployment**
```bash
# Set production environment
NODE_ENV=production
JWT_SECRET=your_production_secret

# Start production server
npm start
```

### **Frontend Deployment**
```bash
# Build for production
npm run build

# Deploy the build folder to your web server
```

### **Docker Deployment** (Optional)
```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 4000
CMD ["npm", "start"]
```

## 🧪 **Testing**

### **Backend Testing**
```bash
cd server
npm test
```

### **Frontend Testing**
```bash
cd client
npm test
```

### **API Testing**
```bash
# Test health endpoint
curl http://localhost:4000/api/health

# Test authentication
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@vccs.edu","password":"admin123"}'
```

## 🔧 **Development**

### **Backend Development**
```bash
cd server
npm run dev          # Start with auto-restart
npm run setup-admin  # Setup demo users
```

### **Frontend Development**
```bash
cd client
npm start           # Start development server
npm run build       # Build for production
npm run lint        # Run linting
```

## 📝 **Configuration**

### **Environment Variables**
```env
# Server Configuration
PORT=4000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

### **Frontend Configuration**
```javascript
// client/src/utils/api.js
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
```

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Add tests if applicable
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License.

## 🆘 **Support**

- **Documentation**: Check the [API Documentation](server/API_DOCUMENTATION.md)
- **Issues**: Open an issue on GitHub
- **Database**: Review `server/data/database.json` for data structure

## 🔄 **Version History**

- **v1.0.0** - Initial release with PostgreSQL backend
- **v1.1.0** - Added document management and file uploads
- **v1.2.0** - Implemented invoice and payment system
- **v1.3.0** - Added data migration capabilities
- **v1.4.0** - Enhanced reporting and analytics
- **v2.0.0** - **Converted to Node.js/Express-only with in-memory database**

---

**EVMS-Virginia Node.js/Express Edition** - Streamlining event management for Virginia institutions with modern web technologies.
