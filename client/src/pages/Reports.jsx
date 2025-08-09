// src/pages/Reports.jsx
import React, { useState } from "react";
import { useRole } from "../contexts/RoleContext";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

export default function Reports() {
  const { role } = useRole();

  // Filters
  const [reportType, setReportType] = useState("Attendance");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [venue, setVenue] = useState("");
  const [college, setCollege] = useState("");

  // Role-based access
  const reportOptions = {
    admin: [
      "Attendance",
      "Financial Summary",
      "Resource Usage",
      "Speaker Engagement",
      "Compliance Audit",
    ],
    eventManager: ["Attendance", "Resource Usage", "Speaker Engagement"],
  };

  // Placeholder chart data
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: `${reportType} Trend`,
        data: [50, 75, 100, 80, 120, 150],
        fill: false,
        borderColor: "#2563eb",
        tension: 0.1,
      },
    ],
  };

  // Placeholder table data
  const tableRows = [
    { col1: "Event A", col2: "120", col3: "$4,500" },
    { col1: "Event B", col2: "95", col3: "$3,200" },
    { col1: "Event C", col2: "210", col3: "$8,700" },
  ];

  const handleExport = (format) => {
    console.log(`Exporting ${reportType} as ${format}`);
    alert(`Exporting ${reportType} as ${format}`);
  };

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

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Reports Center</h1>
        <p className="text-gray-600 mb-6">
          Generate and export detailed reports with filters, visualizations, and compliance tracking.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filter Panel */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
            <h3 className="font-semibold text-gray-700">Filters</h3>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Report Type
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 w-full"
              >
                {reportOptions[role].map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
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

          {/* Report Preview */}
          <div className="lg:col-span-3 space-y-6">
            {/* Chart */}
            <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
              <h3 className="font-semibold mb-4">{reportType} Overview</h3>
              <Line data={chartData} />
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-lg shadow p-4 border border-gray-100 overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 border text-left">Event</th>
                    <th className="p-3 border text-left">Attendance</th>
                    <th className="p-3 border text-left">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="p-3 border">{row.col1}</td>
                      <td className="p-3 border">{row.col2}</td>
                      <td className="p-3 border">{row.col3}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Export Buttons */}
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

            {/* Compliance Footer */}
            <p className="text-xs text-gray-500 mt-2">
              *All reports are logged with timestamps and user IDs for compliance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
