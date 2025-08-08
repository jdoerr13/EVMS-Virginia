import React, { useState } from "react";

export default function ResourceManagement() {
  const [resources] = useState([
    { id: 1, name: "Auditorium A", type: "Venue", status: "Available" },
    { id: 2, name: "Projector Kit", type: "Equipment", status: "In Use" },
    { id: 3, name: "Tech Staff", type: "Staff", status: "Available" },
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Resource Management</h1>
      <p className="mb-6 text-gray-600">
        Demo view of venue, equipment, and staff allocation. Conflicts are
        flagged automatically.
      </p>
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Resource</th>
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {resources.map((r) => (
            <tr key={r.id} className="text-center">
              <td className="p-2 border">{r.name}</td>
              <td className="p-2 border">{r.type}</td>
              <td
                className={`p-2 border font-medium ${
                  r.status === "In Use" ? "text-red-600" : "text-green-600"
                }`}
              >
                {r.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
