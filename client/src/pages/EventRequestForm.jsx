// src/pages/EventRequestForm.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEvents } from "../contexts/EventContext";

export default function EventRequestForm() {
  const navigate = useNavigate();
  const { events, addEvent } = useEvents();

  const [formData, setFormData] = useState({
    title: "",
    college: "",
    venue: "",
    date: "",
    startTime: "",
    endTime: "",
    description: "",
    accommodations: "",
    expectedAttendance: "",
    requesterEmail: "",
  });

  // Optional: simple session builder (you can ignore if not needed)
  const [sessions, setSessions] = useState([
    // { id: "s1", title: "Breakout A", capacity: 50 }
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addSession = () => {
    const id = `s${Date.now()}`;
    setSessions((prev) => [...prev, { id, title: "", capacity: 25 }]);
  };
  const updateSession = (i, key, value) => {
    setSessions((prev) => {
      const copy = [...prev];
      copy[i] = { ...copy[i], [key]: key === "capacity" ? Number(value || 0) : value };
      return copy;
    });
  };
  const removeSession = (i) => {
    setSessions((prev) => prev.filter((_, idx) => idx !== i));
  };

  // Tiny heads-up if something else is already booked that day at that venue
  const sameDayVenueEvents = useMemo(() => {
    const v = formData.venue?.trim().toLowerCase();
    const d = formData.date;
    if (!v || !d) return [];
    return events.filter(
      (e) => e.date === d && (e.venue || "").trim().toLowerCase() === v
    );
  }, [events, formData.venue, formData.date]);

  const validateTimes = () => {
    const { startTime, endTime } = formData;
    if (!startTime || !endTime) return true;
    const [sh, sm] = startTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);
    const start = sh * 60 + sm;
    const end = eh * 60 + em;
    return end > start;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateTimes()) {
      alert("End time must be after start time.");
      return;
    }

    const newEvent = {
      id: Date.now(),
      ...formData,
      expectedAttendance: formData.expectedAttendance
        ? Number(formData.expectedAttendance)
        : undefined,
      status: "Pending",
      requester: formData.requesterEmail || "user@demo.edu",
      // include sessions in the created event (safe even if not used elsewhere yet)
      sessions: sessions.filter((s) => (s.title || "").trim().length > 0),
    };

    addEvent(newEvent);

    // reset
    setFormData({
      title: "",
      college: "",
      venue: "",
      date: "",
      startTime: "",
      endTime: "",
      description: "",
      accommodations: "",
      expectedAttendance: "",
      requesterEmail: "",
    });
    setSessions([]);

    alert("Request submitted! You can track it in the Public Calendar once approved.");
    navigate("/public");
  };

  const colleges = [
    "Tidewater Community College",
    "Northern Virginia Community College",
    "Blue Ridge Community College",
    "Virginia Western Community College",
    "Piedmont Virginia Community College",
  ];

  const venues = [
    "Main Auditorium",
    "Exhibit Hall",
    "Science Building Room 101",
    "Conference Room B",
    "Outdoor Quad",
    "Library Conference Center",
    "Sports Arena",
    "Dining Hall",
    "Computer Lab 3",
    "Music Hall",
  ];

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-2">Request an Event</h2>
      <p className="text-sm text-gray-600 mb-4">
        Fill out the details below. Your request will be submitted for approval.
      </p>

      {/* Heads-up for potential same-day / same-venue */}
      {sameDayVenueEvents.length > 0 && (
        <div role="status" className="mb-4 rounded border border-amber-200 bg-amber-50 p-3 text-sm">
          <strong>Heads up:</strong> There {sameDayVenueEvents.length === 1 ? "is" : "are"}{" "}
          {sameDayVenueEvents.length} other event{sameDayVenueEvents.length === 1 ? "" : "s"} at{" "}
          <em>{formData.venue}</em> on <em>{formData.date}</em>. An event manager will review conflicts.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          placeholder="Event Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
          aria-label="Event Title"
        />

        <select
          name="college"
          value={formData.college}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
          aria-label="College"
        >
          <option value="">Select College</option>
          {colleges.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          name="venue"
          value={formData.venue}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
          aria-label="Venue"
        >
          <option value="">Select Venue</option>
          {venues.map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
            required
            aria-label="Event Date"
          />
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
            required
            aria-label="Start Time"
          />
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
            required
            aria-label="End Time"
          />
        </div>

        <textarea
          name="description"
          placeholder="Event Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          rows="4"
          required
          aria-label="Event Description"
        />

        <textarea
          name="accommodations"
          placeholder="Accessibility/allergy accommodations needed?"
          value={formData.accommodations}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          rows="3"
          aria-label="Accommodations"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="number"
            name="expectedAttendance"
            min="1"
            step="1"
            placeholder="Expected Attendance"
            value={formData.expectedAttendance}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
            aria-label="Expected Attendance"
          />
          <input
            type="email"
            name="requesterEmail"
            placeholder="Your email"
            value={formData.requesterEmail}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
            aria-label="Requester Email"
          />
        </div>

        {/* Sessions (optional) */}
        <div className="border rounded p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Breakout Sessions (optional)</h3>
            <button
              type="button"
              onClick={addSession}
              className="text-sm px-3 py-1 rounded border hover:bg-gray-50"
            >
              + Add Session
            </button>
          </div>
          {sessions.length === 0 && (
            <p className="text-sm text-gray-500">No sessions added.</p>
          )}
          <div className="space-y-2">
            {sessions.map((s, i) => (
              <div key={s.id} className="grid grid-cols-1 sm:grid-cols-6 gap-2 items-center">
                <input
                  value={s.title}
                  onChange={(e) => updateSession(i, "title", e.target.value)}
                  placeholder="Session title"
                  className="sm:col-span-4 border px-3 py-2 rounded"
                  aria-label={`Session ${i + 1} title`}
                />
                <input
                  type="number"
                  min="0"
                  value={s.capacity}
                  onChange={(e) => updateSession(i, "capacity", e.target.value)}
                  placeholder="Capacity"
                  className="sm:col-span-1 border px-3 py-2 rounded"
                  aria-label={`Session ${i + 1} capacity`}
                />
                <button
                  type="button"
                  onClick={() => removeSession(i)}
                  className="sm:col-span-1 text-sm px-3 py-2 rounded border hover:bg-gray-50"
                  aria-label={`Remove session ${i + 1}`}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Submit Request
          </button>
          <button
            type="button"
            onClick={() => navigate("/public")}
            className="px-6 py-2 rounded border"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
