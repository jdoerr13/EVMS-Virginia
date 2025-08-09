import React, { useMemo, useState } from "react";
import CalendarView from "../components/CalendarView";
import VenueFilter from "../components/VenueFilter";
import { useNavigate } from "react-router-dom";
import { useEvents } from "../contexts/EventContext";
import { icsForEvent, icsForEvents, download } from "../utils/ics";

export default function PublicView() {
  const navigate = useNavigate();
  const { events } = useEvents();

  const [query, setQuery] = useState("");
  const [venue, setVenue] = useState("");

  const normalized = (s = "") => s.toLowerCase().trim();

  // Build unique venue list from events (sorted)
  const venueOptions = useMemo(() => {
    return [...new Set(events.map((e) => e.venue).filter(Boolean))].sort();
  }, [events]);

  // Filter events by search (title/venue/college) & selected venue
  const filteredEvents = useMemo(() => {
    const q = normalized(query);
    return events.filter((evt) => {
      const matchesQuery =
        !q ||
        normalized(evt.title).includes(q) ||
        normalized(evt.venue).includes(q) ||
        normalized(evt.college).includes(q);

      const matchesVenue = venue ? evt.venue === venue : true;

      return matchesQuery && matchesVenue;
    });
  }, [events, query, venue]);

  // Current month list for the bottom section
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthlyEvents = useMemo(
    () =>
      filteredEvents.filter((evt) => {
        const d = new Date(evt.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      }),
    [filteredEvents, currentMonth, currentYear]
  );

  const timeRange = (evt) =>
    evt.startTime && evt.endTime ? ` • ${evt.startTime}–${evt.endTime}` : "";

  const handleCalendarClick = (evt) => {
    if (evt?.requestNew) {
      navigate("/request-event");
      return;
    }
    if (evt?.id != null) {
      navigate(`/registration?eventId=${evt.id}`);
    }
  };

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

      {/* FILTERS + CALENDAR */}
      <div className="bg-white shadow rounded-lg p-4 border space-y-3">
        <div className="flex flex-wrap gap-3 items-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, venue, or college…"
            aria-label="Search events"
            className="border px-3 py-2 rounded w-64 h-10"
          />

          <div className="h-10 flex items-center">
            <VenueFilter
              venues={venueOptions}
              selected={venue}
              onChange={setVenue}
            />
          </div>

          <button
            onClick={() => {
              const text = icsForEvents(filteredEvents);
              download("evms-filtered.ics", text);
            }}
            className="px-3 py-2 rounded border hover:bg-gray-50 h-10 flex items-center"
            aria-label="Download filtered ICS feed"
          >
            Subscribe (ICS)
          </button>

          <button
            onClick={() => {
              const today = new Date().toISOString().slice(0, 10);
              const text = icsForEvents(events);
              download(`evms-all-${today}.ics`, text);
            }}
            className="px-3 py-2 rounded border hover:bg-gray-50 h-10 flex items-center"
            aria-label="Export all events as ICS"
          >
            Export Calendar
          </button>

          <button
            onClick={() => {
              setQuery("");
              setVenue("");
            }}
            className="px-3 py-2 rounded border hover:bg-gray-50 h-10 flex items-center"
            aria-label="Reset filters"
          >
            Reset
          </button>
        </div>

        {/* CALENDAR */}
        <CalendarView events={filteredEvents} onEventClick={handleCalendarClick} />
      </div>

      {/* MONTHLY EVENTS LIST */}
      <div className="bg-white shadow rounded-lg p-4 border space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {now.toLocaleString("default", { month: "long", year: "numeric" })} Events
        </h2>

        {monthlyEvents.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {monthlyEvents
              .slice()
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .map((evt) => (
                <li key={evt.id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{evt.title}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(evt.date).toLocaleDateString()} • {evt.venue}
                      {timeRange(evt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        const text = icsForEvent(evt);
                        const safe = (evt.title || "event").replace(/\s+/g, "-").toLowerCase();
                        download(`${safe}.ics`, text);
                      }}
                      className="text-sm px-3 py-1 rounded border hover:bg-gray-50"
                      aria-label={`Download ${evt.title} as ICS`}
                    >
                      Add to Calendar
                    </button>

                    <button
                      onClick={() => navigate(`/registration?eventId=${evt.id}`)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View Details
                    </button>
                  </div>
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
        </button>
        .
      </div>
    </section>
  );
}
