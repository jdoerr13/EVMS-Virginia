// src/pages/DataMigration.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function DataMigration() {
  const navigate = useNavigate();

  // Mock migration history
  const mockMigrations = [
    { id: 1, type: "Events", records: 120, status: "Completed", date: "2025-07-01" },
    { id: 2, type: "Venues", records: 15, status: "Completed", date: "2025-07-03" },
    { id: 3, type: "Contacts", records: 320, status: "Pending", date: "2025-08-01" },
    { id: 4, type: "Contracts", records: 45, status: "Not Started", date: "-" }
  ];

  return (
    <div className="space-y-6">
      {/* Demo mode notice */}
      <div className="bg-gray-100 text-gray-700 p-3 rounded">
        <strong>Demo Mode:</strong> Data migration is read-only. Placeholder per RFP.
      </div>

      {/* Header + back button */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Data Migration</h2>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          ← Back
        </button>
      </div>

      {/* Short RFP description */}
      <div className="bg-white shadow rounded-lg p-4 space-y-2">
        <p>This module will support importing and migrating historical data from legacy systems, including:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Events, venues, and resource records</li>
          <li>Contacts, clients, and registration data</li>
          <li>Contracts, invoices, and payment history</li>
          <li>Associated documents (permits, insurance, diagrams)</li>
        </ul>
        <p className="text-gray-500 text-sm">
          * Per RFP requirements, all imports will support CSV/XLSX, preserve data integrity, and log migration activity.
        </p>
      </div>

      {/* Mock migration table */}
      <table className="w-full border-collapse mt-4">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Data Type</th>
            <th className="p-2 border">Records</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Last Run</th>
          </tr>
        </thead>
        <tbody>
          {mockMigrations.map(m => (
            <tr key={m.id}>
              <td className="p-2 border">{m.type}</td>
              <td className="p-2 border">{m.records}</td>
              <td className="p-2 border">{m.status}</td>
              <td className="p-2 border">{m.date}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Upload/import button (demo only) */}
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
        onClick={() => alert("Demo Mode: Data import is disabled in this demo.")}
      >
        Import Data
      </button>
    </div>
  );
}
