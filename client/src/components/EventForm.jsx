// EventForm.jsx
import React, { useState } from "react";
import { useEvents } from "../contexts/EventContext";

export default function EventForm({ venues = [] }) {
  const { addEvent } = useEvents();

  const [formData, setFormData] = useState({
    title: "",
    college: "",
    venue: venues[0] || "",
    date: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newEvent = {
      id: Date.now(), // unique ID for demo
      ...formData,
      status: "Pending",
      requester: "manager@vccs.edu", // hardcoded for demo
    };

    addEvent(newEvent);

    setFormData({
      title: "",
      college: "",
      venue: venues[0] || "",
      date: "",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow rounded-lg p-6 space-y-4 border border-gray-100"
    >
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Create New Event</h3>

      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Event Title"
        required
        className="w-full border p-3 rounded-md"
      />

      <input
        type="text"
        name="college"
        value={formData.college}
        onChange={handleChange}
        placeholder="College"
        required
        className="w-full border p-3 rounded-md"
      />

      <select
        name="venue"
        value={formData.venue}
        onChange={handleChange}
        className="w-full border p-3 rounded-md"
        required
      >
        {venues.map((v, i) => (
          <option key={i} value={v}>
            {v}
          </option>
        ))}
      </select>

      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
        className="w-full border p-3 rounded-md"
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-semibold p-3 rounded-md hover:bg-blue-700 transition"
      >
        Submit
      </button>
    </form>
  );
}
