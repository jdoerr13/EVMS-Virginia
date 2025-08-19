// src/pages/RegistrationPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEventById, registerFor } from "../utils/api";
import { useEvents } from "../contexts/EventContext";

export default function RegistrationPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [formData, setFormData] = useState({ email: "", phone: "" });
  const { addEvent } = useEvents();
  const navigate = useNavigate();

  // ✅ Load a single event from API
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await getEventById(id);
        setEvent(data);
      } catch (err) {
        console.warn("Failed to fetch event from API, falling back to mock:", err);
        setEvent(null);
      }
    };
    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Build payload here so we can log + reuse
    const payload = {
      event_id: Number(id),
      user_id: 3, // 🟢 fallback demo student
      name: "Johnny Smith",
      ...formData,
    };

    try {
      console.log("📤 Sending registration payload:", payload);
      await registerFor(payload);
      navigate("/student");
    } catch (err) {
      console.warn("Registration failed, falling back to mock:", err);

      // Fallback: add mock registration locally
      addEvent((prev) => ({
        ...prev,
        registrations: [
          ...(prev?.registrations || []),
          { ...payload, id: Date.now(), status: "confirmed" },
        ],
      }));
      navigate("/student");
    }
  };

  if (!event) return <p>Event not found.</p>;

  return (
    <section className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Register for {event.title}</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 shadow rounded">
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Your Phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Register
        </button>
      </form>
    </section>
  );
}
