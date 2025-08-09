// src/pages/CRM.jsx
import React, { useState } from "react";
import { useRole } from "../contexts/RoleContext";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

export default function CRM() {
  const { role } = useRole();

  const [searchTerm, setSearchTerm] = useState("");
  const [stage, setStage] = useState("All");

  if (role !== "admin" && role !== "eventManager") {
    return (
      <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow mt-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
        <p className="text-gray-600">
          You do not have permission to view this page.
        </p>
      </div>
    );
  }

  // Mock chart data for pipeline overview
  const chartData = {
    labels: ["Prospect", "Engaged", "Registered", "Attended", "Closed"],
    datasets: [
      {
        label: "Number of Leads",
        data: [25, 18, 30, 22, 15],
        backgroundColor: [
          "#3b82f6",
          "#6366f1",
          "#10b981",
          "#f59e0b",
          "#ef4444",
        ],
      },
    ],
  };

  // Mock CRM table data
  const contacts = [
    { name: "Alice Johnson", email: "alice@example.com", phone: "555-123-4567", stage: "Prospect" },
    { name: "Bob Smith", email: "bob@example.com", phone: "555-234-5678", stage: "Engaged" },
    { name: "Carla Davis", email: "carla@example.com", phone: "555-345-6789", stage: "Registered" },
    { name: "David Lee", email: "david@example.com", phone: "555-456-7890", stage: "Attended" },
    { name: "Ella Martinez", email: "ella@example.com", phone: "555-567-8901", stage: "Closed" },
  ];

  // Filtered contacts
  const filteredContacts = contacts.filter(
    (c) =>
      (stage === "All" || c.stage === stage) &&
      (c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleExport = (format) => {
    console.log(`Exporting CRM contacts as ${format}`);
    alert(`Exporting CRM contacts as ${format}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">CRM</h1>
        <p className="text-gray-600 mb-6">
          Manage and track event contacts, communication history, and pipeline stage.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filter/Search Panel */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
            <h3 className="font-semibold text-gray-700">Filters</h3>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Search
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search name or email"
                className="border border-gray-300 rounded-lg p-2 w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Stage
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 w-full"
              >
                <option>All</option>
                <option>Prospect</option>
                <option>Engaged</option>
                <option>Registered</option>
                <option>Attended</option>
                <option>Closed</option>
              </select>
            </div>
          </div>

          {/* Data Display */}
          <div className="lg:col-span-3 space-y-6">
            {/* Chart */}
            <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
              <h3 className="font-semibold mb-4">Lead Pipeline Overview</h3>
              <Bar data={chartData} />
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow p-4 border border-gray-100 overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 border text-left">Name</th>
                    <th className="p-3 border text-left">Email</th>
                    <th className="p-3 border text-left">Phone</th>
                    <th className="p-3 border text-left">Stage</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.map((c, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="p-3 border">{c.name}</td>
                      <td className="p-3 border text-blue-600 underline">
                        <a href={`mailto:${c.email}`}>{c.email}</a>
                      </td>
                      <td className="p-3 border">{c.phone}</td>
                      <td className="p-3 border">{c.stage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Export */}
            <div className="flex space-x-4">
              <button
                onClick={() => handleExport("CSV")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Export CSV
              </button>
              <button
                onClick={() => handleExport("PDF")}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Export PDF
              </button>
              <button
                onClick={() => handleExport("Excel")}
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition"
              >
                Export Excel
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-2">
              *All CRM updates are logged with timestamps and user IDs for compliance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
