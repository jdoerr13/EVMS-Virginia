// src/pages/RegistrationPage.jsx
import React, { useState } from "react";

export default function RegistrationPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    session: "",
    accommodations: "",
    marketingOptIn: false,
  });

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: wire to backend later
    alert("Registration submitted! (Demo only)");
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Event Registration</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <select
          name="session"
          value={formData.session}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select a Session</option>
          <option value="keynote">Keynote: Future of Education</option>
          <option value="workshop1">Workshop: Event Planning</option>
          <option value="workshop2">Workshop: Venue Management</option>
        </select>
        <textarea
          name="accommodations"
          placeholder="Special accommodations needed?"
          value={formData.accommodations}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        {/* Opt-in */}
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="marketingOptIn"
            checked={formData.marketingOptIn}
            onChange={handleChange}
          />
          Email me updates about future events
        </label>
        <p className="text-xs text-gray-500">
          We respect your privacy. You can opt out anytime.
        </p>

        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Submit Registration
        </button>
      </form>
    </div>
  );
}
