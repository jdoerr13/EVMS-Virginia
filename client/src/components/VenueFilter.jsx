import React from "react";

/**
 * - Accepts either `selected` or `value` (backwards-compatible)
 * - Forwards any extra props to the <select> (e.g., className)
 */
export default function VenueFilter({
  venues = [],
  selected,
  value,
  onChange,
  ...rest
}) {
  const sel = selected ?? value ?? "";

  return (
    <div className="w-full max-w-md">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Filter by Venue
      </label>
      <select
        value={sel}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        {...rest}
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
