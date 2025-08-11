# EVMS API Documentation

## Base URL
```
http://localhost:4000/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

## 🔐 Authentication Endpoints

### POST /auth/login
**Login with email and password**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
**Response:**
```json
{
  "token": "jwt_token",
  "refreshToken": "refresh_token",
  "role": "admin",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### POST /auth/register
**Register new user**
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "name": "New User",
  "role": "student",
  "collegeId": 1
}
```

### GET /auth/me
**Get current user profile**
*Requires authentication*

### POST /auth/refresh-token
**Refresh JWT token**
```json
{
  "refreshToken": "refresh_token"
}
```

---

## 📅 Events Endpoints

### GET /events
**List events with filters**
```
Query parameters:
- status: Pending|Approved|Rejected|Tentative
- date: YYYY-MM-DD
- start: YYYY-MM-DD
- end: YYYY-MM-DD
- venueId: number
- collegeId: number
- search: string
```

### GET /events/:id
**Get single event details**

### POST /events
**Create new event**
*Requires: eventManager or admin role*
```json
{
  "title": "Event Title",
  "collegeId": 1,
  "venueId": 1,
  "date": "2024-12-25",
  "startTime": "14:00",
  "endTime": "16:00",
  "description": "Event description",
  "maxCapacity": 100
}
```

### PUT /events/:id
**Update event**
*Requires: eventManager or admin role*

### POST /events/:id/hold
**Mark event as tentative**
*Requires: eventManager or admin role*

### PATCH /events/:id/status
**Update event status**
*Requires: admin role*
```json
{
  "decision": "Approved"
}
```

### GET /events/export/csv
**Export events to CSV**
*Requires: admin or eventManager role*

---

## 🏢 Venues Endpoints

### GET /venues
**List venues**
```
Query parameters:
- active: true|false
```

### GET /venues/:id
**Get venue details**

### POST /venues
**Create new venue**
*Requires: admin or eventManager role*
```json
{
  "name": "New Venue",
  "capacity": 200,
  "description": "Venue description",
  "location": "Building A",
  "amenities": ["projector", "sound system"],
  "hourlyRate": 50.00,
  "isActive": true
}
```

### PATCH /venues/:id
**Update venue**
*Requires: admin or eventManager role*

### DELETE /venues/:id
**Delete venue**
*Requires: admin role*

### GET /venues/:id/availability
**Get venue availability**
```
Query parameters:
- startDate: YYYY-MM-DD
- endDate: YYYY-MM-DD
```

### GET /venues/:id/stats
**Get venue statistics**
*Requires: admin or eventManager role*

---

## 👥 Users Endpoints

### GET /users
**List all users**
*Requires: admin role*

### POST /users
**Create new user**
*Requires: admin role*
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "role": "eventManager",
  "name": "New User",
  "collegeId": 1
}
```

### GET /users/profile
**Get current user profile**
*Requires authentication*

### PATCH /users/profile
**Update user profile**
*Requires authentication*

### DELETE /users/:id
**Delete user**
*Requires: admin role*

---

## 📝 Registrations Endpoints

### POST /registrations
**Create new registration**
```json
{
  "eventId": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "123-456-7890",
  "dietaryRestrictions": "Vegetarian",
  "specialAccommodations": "Wheelchair access",
  "userId": 1
}
```

### GET /registrations/event/:eventId
**Get registrations for an event**
*Requires: admin or eventManager role*

### GET /registrations/my-registrations
**Get user's registrations**
*Requires authentication*

### PATCH /registrations/:id
**Update registration**
*Requires: admin or eventManager role*

### DELETE /registrations/:id
**Cancel registration**
*Requires authentication (owner) or admin/eventManager role*

### GET /registrations/stats/:eventId
**Get registration statistics**
*Requires: admin or eventManager role*

---

## 📊 Reports Endpoints

### GET /reports/overview
**Get overall system statistics**
*Requires: admin or eventManager role*
```
Query parameters:
- startDate: YYYY-MM-DD
- endDate: YYYY-MM-DD
```

### GET /reports/by-college
**Get events by college**
*Requires: admin or eventManager role*

### GET /reports/by-venue
**Get events by venue**
*Requires: admin or eventManager role*

### GET /reports/monthly-trends
**Get monthly event trends**
*Requires: admin or eventManager role*
```
Query parameters:
- year: number
```

### GET /reports/registrations
**Get registration statistics**
*Requires: admin or eventManager role*

### GET /reports/top-events
**Get top events by registration count**
*Requires: admin or eventManager role*
```
Query parameters:
- limit: number (default: 10)
- startDate: YYYY-MM-DD
- endDate: YYYY-MM-DD
```

### GET /reports/user-activity
**Get user activity report**
*Requires: admin role*

### GET /reports/venue-utilization
**Get venue utilization report**
*Requires: admin or eventManager role*

### GET /reports/export/:type
**Export reports to CSV**
*Requires: admin or eventManager role*
```
Types: events, registrations
```

---

## 📄 Documents Endpoints

### POST /events/:eventId/docs
**Upload document for an event**
*Requires: admin or eventManager role*
```
Content-Type: multipart/form-data
- document: file (PDF, Word, Excel, text, images)
- description: string
```

### GET /events/:eventId/docs
**Get documents for an event**
*Requires: admin or eventManager role*

### GET /docs/:id/download
**Download document**
*Requires: admin or eventManager role*

### DELETE /docs/:id
**Delete document**
*Requires: admin or eventManager role*

---

## 💰 Invoices & Payments Endpoints

### POST /invoices
**Create invoice**
*Requires: admin or eventManager role*
```json
{
  "eventId": 1,
  "amount": 500.00,
  "description": "Event venue rental",
  "dueDate": "2024-12-31",
  "items": [
    {
      "description": "Venue rental",
      "quantity": 1,
      "unitPrice": 500.00
    }
  ]
}
```

### GET /invoices/event/:eventId
**Get invoices for an event**
*Requires: admin or eventManager role*

### GET /invoices
**Get all invoices**
*Requires: admin role*

### GET /invoices/:id
**Get invoice details**
*Requires: admin or eventManager role*

### POST /invoices/:id/pay
**Process payment**
*Requires: admin or eventManager role*
```json
{
  "paymentMethod": "card",
  "amount": 500.00
}
```

### POST /invoices/refund/:id
**Process refund**
*Requires: admin role*
```json
{
  "amount": 500.00,
  "reason": "Customer request"
}
```

### GET /invoices/:id/payments
**Get payment history**
*Requires: admin or eventManager role*

### GET /invoices/:id/refunds
**Get refund history**
*Requires: admin role*

---

## 🔄 Data Migration Endpoints

### POST /migration/upload
**Upload migration file**
*Requires: admin role*
```
Content-Type: multipart/form-data
- file: CSV or Excel file
- migrationType: string
- description: string
```

### GET /migration/logs
**Get migration logs**
*Requires: admin role*
```
Query parameters:
- status: processing|completed|failed
- startDate: YYYY-MM-DD
- endDate: YYYY-MM-DD
- limit: number (default: 50)
```

### GET /migration/logs/:id
**Get migration log details**
*Requires: admin role*

### POST /migration/logs/:id/retry
**Retry failed migration**
*Requires: admin role*

### DELETE /migration/logs/:id
**Delete migration log**
*Requires: admin role*

### GET /migration/stats
**Get migration statistics**
*Requires: admin role*

---

## 🏫 Colleges Endpoints

### GET /colleges
**List all colleges**

---

## Health Check

### GET /health
**API health check**
```json
{
  "ok": true
}
```

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Environment Variables

Create a `.env` file in the server directory:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/evms_db
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
CORS_ORIGIN=http://localhost:3000
PORT=4000
DATABASE_SSL=false
```

---

## Getting Started

1. Install dependencies:
```bash
cd server
npm install
```

2. Set up database:
```bash
npm run migrate
```

3. Start the server:
```bash
npm run dev
```

The API will be available at `http://localhost:4000/api`
