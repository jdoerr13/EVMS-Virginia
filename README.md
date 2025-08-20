# EVMS – Virginia (Event & Venue Management System)

A hybrid demo platform for scheduling, approvals, and campus/community events across Virginia institutions.  
**Core flows are backed by Postgres**; advanced modules are **mocked** to showcase the full experience requested in the RFP.

---

## 🚦 Current Status (Demo)

- ✅ **Live DB Integration:** Events, Venues, Registrations
- ✅ **Student Flow:** Register → See on Student Dashboard → QR/ICS
- ✅ **Manager Flow:** Create Event → Review Requests → Approve/Reject (UI ready; status route planned)
- ✅ **Public Calendar:** Browse/Filter; Request Event (inserts as *Pending*)
- 🟡 **Auth (Demo):** Simple login; JWT middleware present but tokens not issued in demo
- 🟡 **Admin/Reports/Invoices/CRM:** Mock UI only (for RFP alignment)
- 🔒 **Not production:** plaintext demo passwords; no real payments; mock compliance

---

## 🔧 Tech Stack

- **Frontend:** React + Vite, Tailwind, Headless UI
- **Backend:** Node.js/Express (ESM), `pg` for Postgres
- **DB:** PostgreSQL
- **Other:** ICS export, QR pass generation

---

## 📁 Structure

evms/
├─ client/ # React app
│ └─ src/{pages,components,contexts,utils}
└─ server/ # Express API
├─ server.js # API entry
├─ db.js # PG pool + query helper
├─ routes/
│ ├─ events.js # GET /events, GET /events/:id, POST /events
│ ├─ registrations.js # GET /registrations/student/:id, /event/:id, POST /
│ ├─ venues.js # GET /venues, POST /venues
│ ├─ colleges.js # GET /colleges
│ ├─ auth.js # POST /auth/login (demo)
│ └─ users.js # (JWT-protected endpoints; demo)
└─ init.sql # Schema + seed data

yaml
Copy
Edit

---

## 🚀 Quick Start

### 1) Backend (Postgres + API)
```bash
# In server/
cp .env.example .env   # create and edit your env
npm install

# Create DB & load schema/seed
# (adjust DB name/user as needed)
psql -U postgres -c "CREATE DATABASE evms_dbj;"
psql -U postgres -d evms_dbj -f init.sql

# Run API
npm run dev    # or: node server.js
# API default: http://localhost:4000
.env.example

env
Copy
Edit
PORT=4000
NODE_ENV=development
DATABASE_URL=postgres://postgres:your_password@localhost:5432/evms_dbj
ALLOWED_ORIGINS=http://localhost:3000
JWT_SECRET=change_me_for_prod
2) Frontend
bash
Copy
Edit
# In client/
npm install

# Point client to API
# For Vite:
echo "VITE_API_URL=http://localhost:4000" > .env.local

npm run dev   # http://localhost:3000
🔐 Demo Credentials (from init.sql)
Admin: admin@vccs.edu / admin123

Manager: manager@vccs.edu / manager123

Student: student@vccs.edu / student123

⚠️ Demo login compares plaintext passwords; do not use in production.

📡 API (current demo surface)
Events

GET /events – list events (joins college/venue/requester)

GET /events/:id – single event

POST /events – create event (status defaults to Pending)

Registrations

POST /registrations – create registration (prevents duplicates by event_id + email)

GET /registrations/student/:user_id

GET /registrations/event/:event_id

Venues & Colleges

GET /venues | POST /venues

GET /colleges