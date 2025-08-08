import React from "react";

export default function Reports() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Reports Center</h1>
      <p className="mb-6 text-gray-600">
        Generate and export reports (demo mode — not connected to backend).
      </p>
      <div className="space-y-4">
        <select className="border p-2 rounded w-64">
          <option>Event Summary</option>
          <option>Resource Usage</option>
          <option>Invoice Summary</option>
        </select>
        <div className="space-x-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Export CSV
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Export PDF
          </button>
        </div>
      </div>
    </div>
  );
}
