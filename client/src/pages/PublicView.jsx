// src/pages/PublicView.jsx
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
  const [category, setCategory] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);

const normalized = (s) => (s ? String(s).toLowerCase().trim() : "");

  /** Step 1: Deduplicate events by ID */
const uniqueEvents = useMemo(() => {
  const seen = new Set();
  return events.filter(e => {
    const key = `${normalized(e.title)}|${e.date}|${normalized(e.venue)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}, [events]);

  /** Venue options come from unique events only */
  const venueOptions = useMemo(
    () => [...new Set(uniqueEvents.map((e) => e.venue).filter(Boolean))].sort(),
    [uniqueEvents]
  );

const filteredEvents = useMemo(() => {
  const q = normalized(query);

  return uniqueEvents.filter((evt) => {
    const matchesQuery =
      !q ||
      normalized(evt.title || "").includes(q) ||
      normalized(evt.venue || "").includes(q) ||
      normalized(evt.college || "").includes(q);

    const matchesVenue = venue ? evt.venue === venue : true;

    const matchesCategory = category
      ? normalized(evt.title || "").includes(normalized(category)) ||
        normalized(evt.description || "").includes(normalized(category))
      : true;

    return matchesQuery && matchesVenue && matchesCategory;
  });
}, [uniqueEvents, query, venue, category]);



  const getStatusColor = (status) => {
    switch (status) {
      case "Approved": return "bg-green-600";
      case "Pending":  return "bg-yellow-500";
      case "Closed":   return "bg-red-600";
      default:         return "bg-gray-500";
    }
  };

  const categoryChips = [
    { label: "All", emoji: "✨" },
    { label: "Arts", emoji: "🎭" },
    { label: "Sports", emoji: "🏀" },
    { label: "Tech", emoji: "💻" },
    { label: "Careers", emoji: "💼" },
  ];


const getMockImage = (evt) => {
  const byTitle = {
    "VCCS Fall Open House": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop",
    "VCCS Regional Job & Internship Fair": "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=800&auto=format&fit=crop",
    "VCCS Winter Graduation Ceremony": "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800&auto=format&fit=crop",
    "VCCS Arts & Culture Festival": "https://images.unsplash.com/photo-1497493292307-31c376b6e479?q=80&w=800&auto=format&fit=crop",
"VCCS Healthcare Career Fair": "https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=800&auto=format&fit=crop",



    "VCCS Technology Innovation Expo": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=800&auto=format&fit=crop",
    "VCCS Leadership Summit": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop",
    "VCCS Community Service Day": "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800&auto=format&fit=crop", // ✅ volunteering group
    "VCCS Business & Entrepreneurship Forum": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop",
    "VCCS Student Success Conference": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop",
    "VCCS Research Symposium": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop",
  };

  return byTitle[evt.title] || "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=800&auto=format&fit=crop";
};



  return (
    <section className="p-6 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg p-6 shadow-lg text-center">
        <h1 className="text-4xl font-extrabold mb-2">🎓 Campus & Community Events 🎉</h1>
        <p>Discover fun, educational, and career-building events happening at your college!</p>
      </div>

      {/* Header + Buttons */}
      <header className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => navigate("/request-event")}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            ✍️ Request an Event
          </button>
          <button
            onClick={() => navigate("/speakers")}
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50"
          >
            🎤 Speaker Bios
          </button>
          <button
            onClick={() => {
              const text = icsForEvents(filteredEvents);
              download("evms-filtered.ics", text);
            }}
            className="px-3 py-2 rounded border hover:bg-gray-50"
          >
            📅 Subscribe (ICS)
          </button>
          <button
            onClick={() => {
              const today = new Date().toISOString().slice(0, 10);
              const text = icsForEvents(uniqueEvents);
              download(`evms-all-${today}.ics`, text);
            }}
            className="px-3 py-2 rounded border hover:bg-gray-50"
          >
            📂 Export Calendar
          </button>
          <button
            onClick={() => {
              setQuery("");
              setVenue("");
              setCategory("");
            }}
            className="px-3 py-2 rounded border hover:bg-gray-50"
          >
            ♻️ Reset
          </button>
        </div>

  
      </header>





      {/* Calendar View */}
      <div className="bg-white shadow rounded-lg p-4 border">
        <CalendarView events={filteredEvents} onEventClick={(evt) => setSelectedEvent(evt)} />
      </div>
        {/* Category Chips + Venue Filter */}
        <div className="flex flex-wrap items-center justify-between gap-2 w-full">
          <div className="flex flex-wrap gap-2">
            {categoryChips.map((chip) => (
              <button
                key={chip.label}
                onClick={() => setCategory(chip.label === "All" ? "" : chip.label)}
                className={`px-3 py-1 rounded-full border ${
                  category === chip.label ? "bg-blue-500 text-white" : "bg-white"
                }`}
              >
                {chip.emoji} {chip.label}
              </button>
            ))}
          </div>
          <VenueFilter venues={venueOptions} selected={venue} onChange={setVenue} />
        </div>


   {/* Search + Venue Filter */}
        <div className="flex flex-wrap gap-3 items-center">
          <input
            type="text"
            placeholder="🔍 Search for fun events…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="px-4 py-2 rounded border border-gray-300 flex-1"
          />
        </div>

      {/* Event Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((evt) => (
          <div
            key={evt.id}
            className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition cursor-pointer"
            onClick={() => setSelectedEvent(evt)}
          >
            <div className="relative">
              <img src={getMockImage(evt)} alt={evt.title} className="w-full h-40 object-cover" />
              <span
                className={`absolute top-2 left-2 text-white text-xs font-bold px-2 py-1 rounded ${getStatusColor(evt.status)}`}
              >
                {evt.status}
              </span>
              <span className="absolute bottom-2 right-2 bg-white text-gray-800 text-xs px-2 py-1 rounded">
                📅 {new Date(evt.date).toLocaleDateString()}
              </span>
            </div>
            <div className="p-4 space-y-1">

            <h3 className="text-lg font-semibold">
              {evt.title || "(Untitled Event)"} {(evt.title || "").includes("Graduation") && "🎓"}
            </h3>
              <p className="text-sm text-gray-600">{evt.venue}</p>
              <p className="text-xs text-gray-500">{evt.college}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal (unchanged) */}
      {selectedEvent && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={getMockImage(selectedEvent)} alt={selectedEvent.title} className="w-full h-56 object-cover" />
            <div className="p-6 space-y-4">

               <h2 className="text-3xl font-bold">
   {selectedEvent?.title || "(Untitled Event)"} {((selectedEvent?.title || "").includes("Graduation")) && "🎓"}
 </h2>

              <p className="text-sm text-gray-500">
                📅 {new Date(selectedEvent.date).toLocaleDateString()} • 📍 {selectedEvent.venue} — {selectedEvent.college}
              </p>
              {/* About + Schedule (mock, unchanged) */}
              <div>
                <h3 className="text-lg font-semibold mb-1">ℹ️ About this event</h3>
                <p className="text-gray-700">
                  Join us for an exciting day full of learning, networking, and fun!
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">🗓 Schedule</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>10:00 AM – Welcome Ceremony 🎉</li>
                  <li>11:00 AM – Workshop: Boost Your Skills 💡</li>
                  <li>1:00 PM – Lunch & Networking 🍕</li>
                  <li>3:00 PM – Keynote Speaker 🎤</li>
                  <li>5:00 PM – Closing Remarks 🙌</li>
                </ul>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => navigate(`/registration/${selectedEvent.id}`)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Register
                </button>
                <button
                  onClick={() => {
                    const text = icsForEvent(selectedEvent);
                    const safe = (selectedEvent.title || "event").replace(/\s+/g, "-").toLowerCase();
                    download(`${safe}.ics`, text);
                  }}
                  className="px-4 py-2 rounded border hover:bg-gray-50"
                >
                  Add to Calendar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
