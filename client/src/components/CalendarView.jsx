// src/components/CalendarView.jsx
import React, { useState, useMemo } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/App.css";
import { useNavigate } from "react-router-dom"; // ✅ add this

function toYMDLocal(dateObj) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, "0");
  const d = String(dateObj.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getStatusClasses(status) {
  switch (status) {
    case "Approved": return "bg-green-100 text-green-800 border-green-200";
    case "Pending":  return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Rejected": return "bg-red-100 text-red-800 border-red-200";
    default:         return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

export default function CalendarView({ events = [], onEventClick }) {
  const navigate = useNavigate(); // ✅ use it
  const defaultDate = useMemo(() => {
    if (events?.length > 0 && events[0]?.date) {
      const parts = events[0].date.split("-").map(Number);
      return new Date(parts[0], (parts[1] || 1) - 1, parts[2] || 1);
    }
    return new Date();
  }, [events]);

  const [selectedDate, setSelectedDate] = useState(defaultDate);

  const eventsForDate = useMemo(() => {
    const ymd = toYMDLocal(selectedDate);
    return events.filter((e) => (e?.date || "").trim() === ymd);
  }, [events, selectedDate]);

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Event Calendar</h3>

      <Calendar onChange={setSelectedDate} value={selectedDate} className="mx-auto border rounded-md" />

      <div className="mt-6">
        <h4 className="text-md font-medium text-gray-600 mb-2">
          Events on {selectedDate.toDateString()}
        </h4>

        {eventsForDate.length > 0 ? (
          <ul className="space-y-2">
            {eventsForDate.map((event) => (
              <li
                key={event.id}
                className={`p-3 rounded border flex justify-between items-center ${getStatusClasses(event.status)}`}
              >
                <div>
                  <button
                    onClick={() => onEventClick && onEventClick(event)}
                    className="font-semibold hover:underline"
                  >
                    {event.title || "(Untitled Event)"}
                  </button>
                  <div className="text-sm opacity-80">{event.venue}</div>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusClasses(event.status)}`}
                >
                  {event.status}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm italic">
            No events scheduled. Try browsing the list or{" "}
            <button
              type="button"
              onClick={() => navigate("/request-event")} // ✅ same route as the green button
              className="text-blue-600 underline"
            >
              request an event
            </button>
            .
          </p>
        )}
      </div>
    </div>
  );
}
