// src/pages/ManagerCreateEvent.jsx
import React, { useEffect, useState } from "react";
import { useEvents } from "../contexts/EventContext";
import { getColleges, getVenues } from "../utils/api";

export default function ManagerCreateEvent() {
  const { addEvent } = useEvents();

  const [colleges, setColleges] = useState([]);
  const [venues, setVenues] = useState([]);
  const [form, setForm] = useState({
    title: "",
    college: "",   // human-readable name; addEvent will map to college_id
    venue: "",     // human-readable name; addEvent will map to venue_id
    date: "",
    startTime: "",
    endTime: "",
    max_capacity: "",
    description: "",
    status: "Pending",
  });

  useEffect(() => {
    (async () => {
      const [c, v] = await Promise.all([getColleges(), getVenues()]);
      setColleges(c.data || []);
      setVenues(v.data || []);
    })();
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await addEvent(form);        // context posts & syncs UI
      alert("✅ Event created");
      setForm({
        title: "", college: "", venue: "", date: "",
        startTime: "", endTime: "", max_capacity: "", description: "", status: "Pending",
      });
    } catch (err) {
      console.error("create event failed", err);
      alert("Could not create event. Check console/server logs.");
    }
  };

  return (
    <section className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Create Event</h1>

      <form onSubmit={onSubmit} className="bg-white shadow rounded p-6 space-y-4">
        <input
          name="title"
          value={form.title}
          onChange={onChange}
          placeholder="Title"
          className="border p-2 w-full rounded"
          required
        />

        <div className="grid md:grid-cols-2 gap-4">
          <select
            name="college"
            value={form.college}
            onChange={onChange}
            className="border p-2 rounded"
            required
          >
            <option value="">Select college</option>
            {colleges.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>

          <select
            name="venue"
            value={form.venue}
            onChange={onChange}
            className="border p-2 rounded"
            required
          >
            <option value="">Select venue</option>
            {venues.map((v) => (
              <option key={v.id} value={v.name}>{v.name}</option>
            ))}
          </select>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <input type="date" name="date" value={form.date} onChange={onChange} className="border p-2 rounded" required />
          <input type="time" name="startTime" value={form.startTime} onChange={onChange} className="border p-2 rounded" />
          <input type="time" name="endTime" value={form.endTime} onChange={onChange} className="border p-2 rounded" />
        </div>

        <input
          type="number"
          name="max_capacity"
          value={form.max_capacity}
          onChange={onChange}
          placeholder="Max capacity (optional)"
          className="border p-2 w-full rounded"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={onChange}
          placeholder="Description"
          className="border p-2 w-full rounded"
          rows={4}
        />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Create
        </button>
      </form>
    </section>
  );
}
