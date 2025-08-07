import React from "react";

export default function VenueFilter({ venues = [], selected, onChange }) {
  return (
    <div className="w-full max-w-md">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Filter by Venue
      </label>
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Venues</option>
        {venues.map((venue, i) => (
          <option key={i} value={venue}>
            {venue}
          </option>
        ))}
      </select>
    </div>
  );
}
