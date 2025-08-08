// src/pages/EventRequestForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEvents } from "../contexts/EventContext";

export default function EventRequestForm() {
  const navigate = useNavigate();
  const { addEvent } = useEvents();

  const [formData, setFormData] = useState({
    title: "",
    college: "",
    venue: "",
    date: "",
    description: "",
    accommodations: "",
    expectedAttendance: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newEvent = {
      id: Date.now(),
      ...formData,
      status: "Pending",
      requester: "user@demo.edu", // replace with logged-in user later
    };

    addEvent(newEvent);

    setFormData({
      title: "",
      college: "",
      venue: "",
      date: "",
      description: "",
      accommodations: "",
      expectedAttendance: "",
    });

    navigate("/public");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Request an Event</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          placeholder="Event Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        />
        <select
          name="college"
          value={formData.college}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        >
          <option value="">Select College</option>
          <option value="College A">College A</option>
          <option value="College B">College B</option>
        </select>
        <select
          name="venue"
          value={formData.venue}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        >
          <option value="">Select Venue</option>
          <option value="Venue 1">Venue 1</option>
          <option value="Venue 2">Venue 2</option>
        </select>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Event Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          rows="4"
          required
        />
        <textarea
          name="accommodations"
          placeholder="Accessibility/allergy accommodations needed?"
          value={formData.accommodations}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          rows="3"
        />
        <input
          type="number"
          name="expectedAttendance"
          min="1"
          step="1"
          placeholder="Expected Attendance"
          value={formData.expectedAttendance}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
}
