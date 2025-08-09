// src/pages/RegistrationPage.jsx
import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEvents } from "../contexts/EventContext";
import { useRole } from "../contexts/RoleContext";

export default function RegistrationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { role } = useRole();
  const { events, addRegistration } = useEvents();

  const eventIdParam = new URLSearchParams(location.search).get("eventId");
  const event = eventIdParam
    ? events.find((evt) => String(evt.id) === String(eventIdParam))
    : null;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    accommodations: "",
    allergies: "",
    sessions: [],
    paymentMethod: "Credit Card",
    paymentAmount: "",
  });

  const [showTicket, setShowTicket] = useState(false);

  const capacityRemaining = useMemo(() => {
    if (!event) return {};
    const counts = {};
    (event.registrations || []).forEach((r) => {
      (r.sessions || []).forEach(
        (sid) => (counts[sid] = (counts[sid] || 0) + 1)
      );
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
      return {
        ...prev,
        sessions: has
          ? prev.sessions.filter((x) => x !== sid)
          : [...prev.sessions, sid],
      };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!event) return alert("Event not found.");

    for (const sid of formData.sessions) {
      if ((capacityRemaining[sid] || 0) <= 0) {
        return alert("One or more selected sessions are full.");
      }
    }

    addRegistration(event.id, {
      ...formData,
      dateRegistered: new Date().toISOString(),
    });

    setShowTicket(true);
  };

  const handleAddTestRegistration = () => {
    addRegistration(event.id, {
      name: "Test User",
      email: "test.user@example.com",
      dateRegistered: new Date().toISOString(),
    });
  };

  return (
    <section className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Event Registration</h1>

      {/* Admin or Event Manager with no event selected → Show picker */}
      {!eventIdParam && (role === "admin" || role === "eventManager") && (
        <div className="p-6 bg-white rounded shadow max-w-lg mx-auto mt-4">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Select Event for Registration View
          </h2>
          {events.map((evt) => (
            <button
              key={evt.id}
              onClick={() => navigate(`/registration?eventId=${evt.id}`)}
              className="block w-full text-left px-4 py-2 border rounded mb-2 hover:bg-gray-100"
            >
              {evt.title} — {evt.date}
            </button>
          ))}
        </div>
      )}

      {/* Public with no event selected */}
      {!eventIdParam && role === "public" && (
        <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow mt-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            No Event Selected
          </h2>
          <p className="text-gray-600">
            Please register via an event link from the public calendar.
          </p>
        </div>
      )}

      {/* Show registration form if event selected */}
      {event && (
        <>
          <div className="bg-gray-50 p-4 border rounded">
            <p>
              <strong>Event:</strong> {event.title}
            </p>
            <p>
              <strong>Venue:</strong> {event.venue}
            </p>
            <p>
              <strong>Date/Time:</strong> {event.date} • {event.startTime}–
              {event.endTime}
            </p>
          </div>

          {!showTicket ? (
            <form
              onSubmit={handleSubmit}
              className="bg-white shadow rounded-lg p-6 border border-gray-100 space-y-4"
            >
              <div>
                <label className="block text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded shadow-sm"
                />
              </div>

              <div>
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <div className="font-semibold">Choose Sessions</div>
                {(event?.sessions || []).map((s) => {
                  const remaining = Math.max(
                    0,
                    capacityRemaining[s.id] || 0
                  );
                  const isFull = remaining <= 0;
                  return (
                    <label key={s.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.sessions.includes(s.id)}
                        disabled={isFull}
                        onChange={() => toggleSession(s.id)}
                      />
                      <span>
                        {s.title} — {remaining} seats left
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          isFull
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {isFull ? "Full" : "Available"}
                      </span>
                    </label>
                  );
                })}
              </div>

              <div>
                <label className="block text-gray-700">Accommodations</label>
                <textarea
                  name="accommodations"
                  value={formData.accommodations}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded shadow-sm"
                />
              </div>

              <div>
                <label className="block text-gray-700">Allergies</label>
                <textarea
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded shadow-sm"
                />
              </div>

              {/* Mock Payment */}
              <div className="bg-gray-50 p-4 rounded border">
                <h3 className="font-semibold text-gray-700 mb-2">
                  Payment Information (Mock)
                </h3>
                <label className="block text-gray-700">Payment Method</label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded shadow-sm"
                >
                  <option>Credit Card</option>
                  <option>PayPal</option>
                  <option>Check</option>
                </select>

                <label className="block text-gray-700 mt-3">Amount</label>
                <input
                  type="number"
                  name="paymentAmount"
                  value={formData.paymentAmount}
                  onChange={handleChange}
                  placeholder="e.g., 50.00"
                  className="mt-1 block w-full border-gray-300 rounded shadow-sm"
                />
              </div>

              <button
                type="submit"
                disabled={!event}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
              >
                Register
              </button>
            </form>
          ) : (
            <div className="bg-white shadow rounded-lg p-6 border border-gray-100">
              <h2 className="text-xl font-bold mb-4">
                Registration Confirmed!
              </h2>
              <div className="border p-4 rounded flex items-center gap-4">
                <img
                  src="https://via.placeholder.com/80x80.png?text=Logo"
                  alt="Event Logo"
                  className="rounded"
                />
                <div>
                  <p className="font-bold">{event.title}</p>
                  <p>
                    {event.date} • {event.startTime}–{event.endTime}
                  </p>
                  <p>{event.venue}</p>
                  <p className="mt-2 font-semibold">{formData.name}</p>
                </div>
                <img
                  src="https://via.placeholder.com/80x80.png?text=QR"
                  alt="QR Code"
                  className="ml-auto"
                />
              </div>
            </div>
          )}

          {/* Admin Attendee List */}
          {(role === "admin" || role === "eventManager") && (
            <div className="bg-white shadow rounded-lg p-4 border mt-6">
              <h2 className="text-lg font-semibold mb-2">
                Attendee List (Mock)
              </h2>
              <button
                onClick={handleAddTestRegistration}
                className="mb-4 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Add Test Registration
              </button>
              <ul className="list-disc ml-5 text-sm">
                {(event.registrations || []).map((r, i) => (
                  <li key={i}>
                    {r.name} — {r.email}
                  </li>
                ))}
                {(!event.registrations ||
                  event.registrations.length === 0) && (
                  <li className="text-gray-500">No registrations yet.</li>
                )}
              </ul>
            </div>
          )}
        </>
      )}
    </section>
  );
}
