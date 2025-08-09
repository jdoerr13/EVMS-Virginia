// src/pages/ResourceManagement.jsx
import React, { useState } from "react";
import { useRole } from "../contexts/RoleContext";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

export default function ResourceManagement() {
  const { role } = useRole();

  const [resourceType, setResourceType] = useState("Audio/Visual");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [venue, setVenue] = useState("");
  const [college, setCollege] = useState("");

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

  // Dynamic mock chart data based on resource type
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
    datasets: [
      {
        label: `${resourceType} Usage`,
        data:
          resourceType === "Audio/Visual"
            ? [42, 56, 48, 75, 60, 90, 85, 95]
            : resourceType === "Furniture"
            ? [120, 150, 100, 175, 140, 160, 180, 190]
            : resourceType === "Technology"
            ? [15, 20, 25, 18, 30, 28, 40, 38]
            : resourceType === "Signage"
            ? [8, 12, 6, 10, 15, 14, 20, 18]
            : [60, 72, 65, 80, 90, 100, 95, 110],
        fill: true,
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.2)",
        tension: 0.3,
      },
    ],
  };

  // Table placeholder data
  const tableRows = [
    { resource: "Projector", qty: 4, status: "Available", location: "Main Auditorium" },
    { resource: "Wireless Mic", qty: 10, status: "In Use", location: "Room 201" },
    { resource: "Folding Chairs", qty: 200, status: "Available", location: "Storage A" },
  ];

  const handleExport = (format) => {
    console.log(`Exporting ${resourceType} data as ${format}`);
    alert(`Exporting ${resourceType} data as ${format}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Resource Management</h1>
        <p className="text-gray-600 mb-6">
          Track, allocate, and optimize event resources across venues and colleges.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filter Panel */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
            <h3 className="font-semibold text-gray-700">Filters</h3>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Resource Type
              </label>
              <select
                value={resourceType}
                onChange={(e) => setResourceType(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 w-full"
              >
                <option>Audio/Visual</option>
                <option>Furniture</option>
                <option>Technology</option>
                <option>Signage</option>
                <option>Staffing</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Start Date
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, start: e.target.value }))
                }
                className="border border-gray-300 rounded-lg p-2 w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                End Date
              </label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, end: e.target.value }))
                }
                className="border border-gray-300 rounded-lg p-2 w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Venue
              </label>
              <input
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="e.g., Main Auditorium"
                className="border border-gray-300 rounded-lg p-2 w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                College
              </label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="e.g., Northern VA CC"
                className="border border-gray-300 rounded-lg p-2 w-full"
              />
            </div>
          </div>

          {/* Data Display */}
          <div className="lg:col-span-3 space-y-6">
            {/* Chart */}
            <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
              <h3 className="font-semibold mb-4">{resourceType} Overview</h3>
              <Line data={chartData} />
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow p-4 border border-gray-100 overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 border text-left">Resource</th>
                    <th className="p-3 border text-left">Quantity</th>
                    <th className="p-3 border text-left">Status</th>
                    <th className="p-3 border text-left">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="p-3 border">{row.resource}</td>
                      <td className="p-3 border">{row.qty}</td>
                      <td
                        className={`p-3 border font-semibold ${
                          row.status === "Available"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {row.status}
                      </td>
                      <td className="p-3 border">{row.location}</td>
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
              *All resource logs are tracked with timestamps and user IDs for compliance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
