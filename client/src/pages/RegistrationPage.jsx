// src/pages/RegistrationPage.jsx
import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useEvents } from "../contexts/EventContext";

export default function RegistrationPage() {
  const location = useLocation();
  const eventId = new URLSearchParams(location.search).get("eventId");
  const { events, addRegistration } = useEvents();

  const event = events.find((evt) => String(evt.id) === String(eventId));

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    accommodations: "",
    allergies: "",
    sessions: [], // selected session ids
  });

  const capacityRemaining = useMemo(() => {
    if (!event) return {};
    const counts = {};
    (event.registrations || []).forEach((r) => {
      (r.sessions || []).forEach((sid) => (counts[sid] = (counts[sid] || 0) + 1));
    });
    const remaining = {};
    (event.sessions || []).forEach((s) => {
      remaining[s.id] = s.capacity - (counts[s.id] || 0);
    });
    return remaining;
  }, [event]);

  const toggleSession = (sid) => {
    setFormData((prev) => {
      const has = prev.sessions.includes(sid);
      return { ...prev, sessions: has ? prev.sessions.filter((x) => x !== sid) : [...prev.sessions, sid] };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!event) return alert("Event not found. Please try again.");

    // enforce capacity
    for (const sid of formData.sessions) {
      if ((capacityRemaining[sid] || 0) <= 0) {
        return alert("One or more selected sessions are full. Please adjust selections.");
      }
    }

    addRegistration(event.id, {
      ...formData,
      dateRegistered: new Date().toISOString(),
    });

    alert("Registration successful!");
    setFormData({ name: "", email: "", accommodations: "", allergies: "", sessions: [] });
  };

  return (
    <section className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Event Registration</h1>

      {event ? (
        <div className="bg-gray-50 p-4 border rounded">
          <p><strong>Event:</strong> {event.title}</p>
          <p><strong>Venue:</strong> {event.venue}</p>
          <p><strong>Date/Time:</strong> {event.date} • {event.startTime}–{event.endTime}</p>
        </div>
      ) : (
        <p className="text-red-600">No event selected. Please register via an event link.</p>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 border border-gray-100 space-y-4">
        <div>
          <label className="block text-gray-700">Full Name</label>
          <input type="text" name="name" required value={formData.name} onChange={handleChange}
                 className="mt-1 block w-full border-gray-300 rounded shadow-sm" />
        </div>

        <div>
          <label className="block text-gray-700">Email</label>
          <input type="email" name="email" required value={formData.email} onChange={handleChange}
                 className="mt-1 block w-full border-gray-300 rounded shadow-sm" />
        </div>

        <div className="space-y-2">
          <div className="font-semibold">Choose Sessions</div>
          {(event?.sessions || []).map((s) => (
            <label key={s.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.sessions.includes(s.id)}
                disabled={(capacityRemaining[s.id] || 0) <= 0}
                onChange={() => toggleSession(s.id)}
              />
              <span>{s.title} — {Math.max(0, capacityRemaining[s.id] || 0)} seats left</span>
            </label>
          ))}
          {(!event?.sessions || event.sessions.length === 0) && (
            <div className="text-sm text-gray-500">No breakout sessions for this event.</div>
          )}
        </div>

        <div>
          <label className="block text-gray-700">Accommodations</label>
          <textarea name="accommodations" value={formData.accommodations} onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded shadow-sm" />
        </div>

        <div>
          <label className="block text-gray-700">Allergies</label>
          <textarea name="allergies" value={formData.allergies} onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded shadow-sm" />
        </div>

        <button type="submit" disabled={!event}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50">
          Register
        </button>
      </form>

      {/* Simple docs list to show we support attachments (mock) */}
      {event && (
        <div className="bg-white shadow rounded-lg p-4 border">
          <h2 className="text-lg font-semibold mb-2">Event Documents (demo)</h2>
          <ul className="list-disc ml-5 text-sm">
            {(event.docs || []).map((d, i) => <li key={i}>{d.name}</li>)}
            {(!event.docs || event.docs.length === 0) && <li className="text-gray-500">No documents uploaded yet.</li>}
          </ul>
        </div>
      )}
    </section>
  );
}
