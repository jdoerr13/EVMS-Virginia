import React, { useState } from "react";
import EventForm from "../components/EventForm";
import VenueFilter from "../components/VenueFilter";


export default function EventManager() {
  const [events] = useState([
    { title: "Event 1", status: "Approved" },
    { title: "Event 2", status: "Pending" },
  ]);

  const [selectedVenue, setSelectedVenue] = useState("");
  const venues = ["Main Hall", "Auditorium", "Gym", "Conference Room"];

  return (
    <section className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Event Manager</h1>

      <VenueFilter
        venues={venues}
        selected={selectedVenue}
        onChange={setSelectedVenue}
      />

<EventForm venues={venues} />

      <div className="bg-white shadow rounded-lg p-6 border border-gray-100">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Your Events</h2>
        <ul className="divide-y divide-gray-200">
          {events.map((event, i) => (
            <li key={i} className="py-4 flex justify-between">
              <span className="text-gray-700 font-medium">{event.title}</span>
              <span className={`text-sm font-semibold ${
                event.status === "Approved" ? "text-green-600" : "text-yellow-600"
              }`}>
                {event.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
