// src/pages/Venues.jsx
import React, { useState } from "react";
import { useRole } from "../contexts/RoleContext";

// Seed mock venues
const seedVenues = () => [
  {
    id: 1,
    name: "Main Auditorium",
    location: "Tidewater Community College",
    capacity: 500,
    resources: "Stage, AV System, Seating",
  },
  {
    id: 2,
    name: "Exhibit Hall",
    location: "Northern Virginia Community College",
    capacity: 300,
    resources: "Booths, Projector, Wi-Fi",
  },
  {
    id: 3,
    name: "Student Commons",
    location: "Virginia Western Community College",
    capacity: 200,
    resources: "Tables, Chairs, PA System",
  },
  {
    id: 4,
    name: "Nursing Building Auditorium",
    location: "Piedmont Virginia Community College",
    capacity: 150,
    resources: "AV Equipment, Exam Tables",
  },
  {
    id: 5,
    name: "Science Lecture Hall",
    location: "Tidewater Community College",
    capacity: 120,
    resources: "Lab Benches, Microscopes, AV System",
  },
  {
    id: 6,
    name: "Fine Arts Center",
    location: "Northern Virginia Community College",
    capacity: 400,
    resources: "Stage, Lighting Rig, Acoustic Panels",
  },
  {
    id: 7,
    name: "Conference Room A",
    location: "Piedmont Virginia Community College",
    capacity: 50,
    resources: "Projector, Whiteboard, Conference Table",
  },
  {
    id: 8,
    name: "Athletic Complex",
    location: "Virginia Western Community College",
    capacity: 1000,
    resources: "Basketball Court, Bleachers, PA System",
  },
  {
    id: 9,
    name: "Outdoor Amphitheater",
    location: "Tidewater Community College",
    capacity: 800,
    resources: "Stage, Outdoor Seating, Lighting",
  },
  {
    id: 10,
    name: "Innovation Lab",
    location: "Northern Virginia Community College",
    capacity: 60,
    resources: "3D Printers, Workbenches, High-Speed Internet",
  },
];

export default function Venues() {
  const { role } = useRole();
  const [venues, setVenues] = useState(seedVenues());
  const [search, setSearch] = useState("");
  const [selectedVenue, setSelectedVenue] = useState(null);

  const filteredVenues = venues.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.location.toLowerCase().includes(search.toLowerCase())
  );

  const addMockVenue = () => {
    const mockNames = ["Tech Hall", "Art Studio", "Wellness Center"];
    const mockLocations = [
      "Tidewater Community College",
      "Northern Virginia Community College",
      "Piedmont Virginia Community College",
    ];
    const mockResources = [
      "Stage, AV System",
      "Projector, Wi-Fi",
      "Gym Equipment, Locker Rooms",
    ];

    const newVenue = {
      id: Date.now(),
      name: mockNames[Math.floor(Math.random() * mockNames.length)],
      location: mockLocations[Math.floor(Math.random() * mockLocations.length)],
      capacity: Math.floor(Math.random() * 900) + 50,
      resources:
        mockResources[Math.floor(Math.random() * mockResources.length)],
    };

    setVenues((prev) => [...prev, newVenue]);
  };

  const deleteVenue = (id) => {
    if (window.confirm("Delete this venue?")) {
      setVenues((prev) => prev.filter((v) => v.id !== id));
      setSelectedVenue(null);
    }
  };

  const exportData = (format) => {
    alert(`Exporting venues as ${format} (demo mode)`);
  };

  return (
    <section className="space-y-6 p-6">
      {/* RFP Description */}
            <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Venue Inventory</h2>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          ← Back
        </button>
      </div>
      <div className="bg-white shadow rounded-lg p-4 space-y-2 border border-gray-200">
        <p>
          This section manages a complete inventory of venues and associated
          resources, including:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Multiple venue and room tracking with availability calendars</li>
          <li>Equipment inventory linked to specific venues</li>
          <li>Staffing and support resources for each booking</li>
          <li>Conflict prevention and scheduling holds</li>
        </ul>
      </div>

      {/* Search & Add */}
      <div className="flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Search by venue or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full max-w-sm"
        />
        {role === "admin" && (
          <button
            onClick={addMockVenue}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Add Mock Venue
          </button>
        )}
      </div>

      {/* Venue Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVenues.map((venue) => (
          <div
            key={venue.id}
            className="bg-white p-4 shadow rounded-lg border border-gray-200 flex flex-col justify-between"
          >
            <div>
              <h3 className="font-bold text-lg">{venue.name}</h3>
              <p className="text-sm text-gray-600">{venue.location}</p>
              <p className="mt-1 text-sm">
                Capacity: <strong>{venue.capacity}</strong>
              </p>
              <p className="text-sm text-gray-700">
                Resources: {venue.resources}
              </p>
            </div>
            <button
              onClick={() => setSelectedVenue(venue)}
              className="mt-4 bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow p-4 border border-gray-200 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Location</th>
              <th className="p-2 border">Capacity</th>
              <th className="p-2 border">Resources</th>
              {role === "admin" && <th className="p-2 border">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredVenues.map((venue) => (
              <tr key={venue.id}>
                <td className="p-2 border">{venue.name}</td>
                <td className="p-2 border">{venue.location}</td>
                <td className="p-2 border">{venue.capacity}</td>
                <td className="p-2 border">{venue.resources}</td>
                {role === "admin" && (
                  <td className="p-2 border space-x-2">
                    <button
                      onClick={() => setSelectedVenue(venue)}
                      className="px-2 py-1 bg-indigo-600 text-white rounded"
                    >
                      View
                    </button>
                    <button
                      onClick={() => deleteVenue(venue.id)}
                      className="px-2 py-1 bg-red-600 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {role === "admin" && (
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => exportData("CSV")}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Export CSV
            </button>
            <button
              onClick={() => exportData("PDF")}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Export PDF
            </button>
            <button
              onClick={() => exportData("Excel")}
              className="bg-yellow-500 text-white px-3 py-1 rounded"
            >
              Export Excel
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedVenue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
            <button
              onClick={() => setSelectedVenue(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4">{selectedVenue.name}</h2>
            <p className="mb-2">
              <strong>Location:</strong> {selectedVenue.location}
            </p>
            <p className="mb-2">
              <strong>Capacity:</strong> {selectedVenue.capacity}
            </p>
            <p className="mb-4">
              <strong>Resources:</strong> {selectedVenue.resources}
            </p>
            <p className="italic text-gray-500 mb-4">
              Availability Calendar — future integration.
            </p>
            {role === "admin" && (
              <div className="flex gap-2">
                <button className="bg-indigo-600 text-white px-3 py-1 rounded">
                  Edit
                </button>
                <button
                  onClick={() => deleteVenue(selectedVenue.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
