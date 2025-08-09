// src/pages/Venues.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Venues() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  // Mock venue data for demo mode
  const mockVenues = [
    {
      id: 1,
      name: "Main Auditorium",
      location: "Tidewater Community College",
      capacity: 500,
      resources: "Stage, AV System, Seating"
    },
    {
      id: 2,
      name: "Exhibit Hall",
      location: "Northern Virginia Community College",
      capacity: 300,
      resources: "Booths, Projector, Wi-Fi"
    },
    {
      id: 3,
      name: "Student Commons",
      location: "Virginia Western Community College",
      capacity: 200,
      resources: "Tables, Chairs, PA System"
    }
  ];

  const filteredVenues = mockVenues.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Demo mode notice */}
      <div className="bg-gray-100 text-gray-700 p-3 rounded">
        <strong>Demo Mode:</strong> Venue management is read-only. Placeholder per RFP.
      </div>

      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Venue Inventory</h2>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          ← Back
        </button>
      </div>

      {/* Short RFP description */}
      <div className="bg-white shadow rounded-lg p-4 space-y-2">
        <p>This section will manage a complete inventory of venues and associated resources, including:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Multiple venue and room tracking with availability calendars</li>
          <li>Equipment inventory linked to specific venues</li>
          <li>Staffing and support resources for each booking</li>
          <li>Conflict prevention and scheduling holds</li>
        </ul>
        <p className="text-gray-500 text-sm">
          * Per RFP requirements, this will integrate with booking, contracts, and reporting in a future phase.
        </p>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by venue or location..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded w-full max-w-sm"
      />

      {/* Table */}
      <table className="w-full border-collapse mt-4">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Location</th>
            <th className="p-2 border">Capacity</th>
            <th className="p-2 border">Resources</th>
          </tr>
        </thead>
        <tbody>
          {filteredVenues.length > 0 ? (
            filteredVenues.map(venue => (
              <tr key={venue.id}>
                <td className="p-2 border">{venue.name}</td>
                <td className="p-2 border">{venue.location}</td>
                <td className="p-2 border">{venue.capacity}</td>
                <td className="p-2 border">{venue.resources}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="p-4 text-center text-gray-500">
                No venues found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Add Venue (demo only) */}
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
        onClick={() => alert("Demo Mode: Adding venues is disabled in this demo.")}
      >
        Add Venue
      </button>
    </div>
  );
}
