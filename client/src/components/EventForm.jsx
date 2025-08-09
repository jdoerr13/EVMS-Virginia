// src/pages/EventForm.jsx
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-lg p-6 space-y-4 border border-gray-100"
      >
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Create New Event
        </h3>

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

      {/* Event Pass Preview */}
      <div className="flex items-center justify-center">
        <div className="w-72 h-[420px] rounded-xl shadow-lg overflow-hidden relative border border-gray-300">
          {/* Background image */}
          <img
            src="https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=500&q=80"
            alt="Event Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-between p-4">
            <div>
              <h2 className="text-white font-bold text-lg leading-tight">
                {formData.title || "Sample Event Name"}
              </h2>
              <p className="text-gray-200 text-sm">
                {formData.date || "2025-09-15"}
              </p>
            </div>

            <div className="text-center">
              <p className="text-white text-xl font-bold">
                John Smith
              </p>
              <p className="text-gray-300 text-sm">Attendee</p>
            </div>

            <div className="flex justify-between items-end">
              <img
                src="https://via.placeholder.com/50x50.png?text=Logo"
                alt="Logo"
                className="w-12 h-12 bg-white p-1 rounded"
              />
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=Sample"
                alt="QR Code"
                className="w-16 h-16 bg-white p-1 rounded"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
