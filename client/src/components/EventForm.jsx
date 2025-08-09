import React, { useState } from "react";
import { useEvents } from "../contexts/EventContext";

export default function EventForm({ venues = [] }) {
  const { addEvent } = useEvents();

  const [formData, setFormData] = useState({
    title: "",
    college: "",
    venue: venues[0] || "",
    date: "",
    startTime: "",
    endTime: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateTimes = () => {
    const { startTime, endTime } = formData;
    if (!startTime || !endTime) return true;
    const [sh, sm] = startTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);
    return eh * 60 + em > sh * 60 + sm;
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
      status: "Pending",
      requester: "manager@vccs.edu",
    };

    addEvent(newEvent);

    setFormData({
      title: "",
      college: "",
      venue: venues[0] || "",
      date: "",
      startTime: "",
      endTime: "",
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
        disabled={venues.length === 0}
      >
        {venues.length === 0 ? (
          <option value="">No venues available</option>
        ) : (
          venues.map((v, i) => (
            <option key={i} value={v}>
              {v}
            </option>
          ))
        )}
      </select>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="w-full border p-3 rounded-md"
        />
        <input
          type="time"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
          required
          className="w-full border p-3 rounded-md"
        />
        <input
          type="time"
          name="endTime"
          value={formData.endTime}
          onChange={handleChange}
          required
          className="w-full border p-3 rounded-md"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-semibold p-3 rounded-md hover:bg-blue-700 transition"
      >
        Submit
      </button>
    </form>
  );
}
