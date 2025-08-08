import React, { useState } from "react";
import CalendarView from "../components/CalendarView";
import VenueFilter from "../components/VenueFilter";
import { useNavigate } from "react-router-dom";
import { useEvents } from "../contexts/EventContext";

export default function PublicView() {
  const navigate = useNavigate();
  const { events } = useEvents();
  const [query, setQuery] = useState("");
  const [venue, setVenue] = useState("");

  // Filter events by search & venue
  const filteredEvents = events.filter(evt =>
    evt.title.toLowerCase().includes(query.toLowerCase()) &&
    (venue ? evt.venue === venue : true)
  );

  // Group events by month/year
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyEvents = filteredEvents.filter(evt => {
    const date = new Date(evt.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  return (
    <section className="p-6 space-y-8">
      {/* HEADER */}
      <header className="flex flex-wrap items-center gap-3 justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Public Event Calendar</h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/speakers")}
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50"
          >
            Speaker Bios
          </button>
          <button
            onClick={() => navigate("/request-event")}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Request an Event
          </button>
        </div>
      </header>

    {/* FILTERS */}
<div className="bg-white shadow rounded-lg p-4 border space-y-3">
  <div className="flex flex-wrap gap-3 items-center">
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search events…"
      className="border px-3 py-2 rounded w-64 h-10"
    />

    <div className="h-10 flex items-center">
      <VenueFilter
        value={venue}
        onChange={setVenue}
        className="h-full"
      />
    </div>

    <button className="px-3 py-2 rounded border hover:bg-gray-50 h-10 flex items-center">
      Subscribe (ICS)
    </button>
    <button className="px-3 py-2 rounded border hover:bg-gray-50 h-10 flex items-center">
      Export Calendar
    </button>
  </div>

  {/* CALENDAR */}
  <CalendarView
    events={filteredEvents}
    onEventClick={(evt) => navigate(`/registration?eventId=${evt.id}`)}
  />
</div>


      {/* MONTHLY EVENTS LIST */}
      <div className="bg-white shadow rounded-lg p-4 border space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {new Date().toLocaleString("default", { month: "long", year: "numeric" })} Events
        </h2>
        {monthlyEvents.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {monthlyEvents
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .map((evt) => (
                <li key={evt.id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{evt.title}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(evt.date).toLocaleDateString()} • {evt.venue}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/registration?eventId=${evt.id}`)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View Details
                  </button>
                </li>
              ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">No events scheduled for this month.</p>
        )}
      </div>

      {/* ACCESSIBILITY INFO */}
      <div className="bg-blue-50 border border-blue-100 rounded p-4 text-sm">
        Need <strong>allergy/accommodation</strong> support? You can request it during registration.{" "}
        For accessibility help, see our{" "}
        <button
          className="underline text-blue-700"
          onClick={() => navigate("/accessibility-demo")}
        >
          Accessibility options
        </button>.
      </div>
    </section>
  );
}
