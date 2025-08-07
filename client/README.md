# EVMS-Virginia (Client)

**Event and Venue Management System - Virginia Edition (Client App)**  
Frontend for a full-stack platform designed to streamline scheduling, approvals, and oversight for institutional events and facility bookings.

---

## 🧩 Overview

This React-based application serves as the admin and user-facing interface of the EVMS-Virginia platform. It allows faculty, staff, and administrators to:

- Submit event requests
- View approval statuses
- Manage venue availability
- Visualize data through charts and dashboards
- Export/import CSV reports

---

## 🛠️ Tech Stack

- **Frontend Framework**: React (w/ Hooks & Context API)
- **Styling**: Tailwind CSS
- **Charts & Visuals**: Recharts
- **Forms**: React forms with basic validation
- **CSV Handling**: Custom CSV import/export utilities

---

## 🗂️ Folder Structure

client/
│
├── public/ # Static assets
├── src/
│ ├── components/ # Reusable UI components
│ ├── contexts/ # Global state (events, roles)
│ ├── pages/ # Main route-level pages
│ ├── utils/ # CSV utilities, helpers
│ └── App.js # App routing and layout
├── .gitignore
├── package.json
└── README.md

---

## 📦 Setup Instructions

1. Clone the repository:

   git clone https://github.com/jdoerr13/EVMS-Virginia.git
   cd EVMS-Virginia/client


2. Install dependencies:

npm install

3. Start the development server:

npm start


📁 .gitignore (already included)
node_modules/
.env
.DS_Store
.vscode/
build/
.cache/