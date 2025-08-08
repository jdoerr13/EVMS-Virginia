import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/App.css"; // Tailwind overrides if needed

export default function CalendarView({ events = [], onEventClick }) {
  const [selectedDate, setSelectedDate] = useState(
    events.length > 0 ? new Date(events[0].date) : new Date()
  );

  const eventsForDate = events.filter(
    (event) => event.date === selectedDate.toISOString().split("T")[0]
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

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
            {eventsForDate.map((event) => (
              <li
                key={event.id}
                className={`p-3 rounded border flex justify-between items-center ${getStatusColor(event.status)}`}
              >
                <div>
                  <button
                    onClick={() => onEventClick && onEventClick(event)}
                    className="font-semibold hover:underline"
                  >
                    {event.title}
                  </button>
                  <div className="text-sm opacity-80">{event.venue}</div>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                    event.status
                  )}`}
                >
                  {event.status}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm italic">
            No events scheduled. Try browsing the monthly list or{" "}
            <button
              onClick={() => onEventClick && onEventClick({ requestNew: true })}
              className="text-blue-600 underline"
            >
              request an event
            </button>.
          </p>
        )}
      </div>
    </div>
  );
}
