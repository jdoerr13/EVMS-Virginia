import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/App.css"; // Tailwind-enhanced overrides if needed

export default function CalendarView({ events = [] }) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const eventsForDate = events.filter(
    (event) => event.date === selectedDate.toISOString().split("T")[0]
  );

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Event Calendar</h3>
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        className="mx-auto border rounded-md"
      />

      <div className="mt-6">
        <h4 className="text-md font-medium text-gray-600 mb-2">
          Events on {selectedDate.toDateString()}
        </h4>
        {eventsForDate.length > 0 ? (
          <ul className="space-y-2">
            {eventsForDate.map((event, i) => (
              <li
                key={i}
                className="bg-blue-50 p-3 rounded border border-blue-200 text-blue-800"
              >
                <strong>{event.title}</strong> — {event.venue}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm italic">No events scheduled.</p>
        )}
      </div>
    </div>
  );
}
