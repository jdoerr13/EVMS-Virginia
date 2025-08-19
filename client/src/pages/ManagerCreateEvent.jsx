// // ManagerCreateEvent.jsx
// import React from "react";
// import EventForm from "../components/EventForm";

// const venues = ["Main Hall", "Auditorium", "Gym", "Conference Room"];

// export default function ManagerCreateEvent() {
//   return (
//     <section className="p-6 space-y-6">
//       <h1 className="text-3xl font-bold text-gray-800">Create Event</h1>

//       <div className="bg-white shadow rounded-lg p-6 border border-gray-100">
//         <EventForm venues={venues} />
//       </div>
//     </section>
//   );
// }
import React, { useState } from "react";
import { useEvents } from "../contexts/EventContext";
import { postEvent } from "../utils/api";

export default function ManagerCreateEvent() {
  const { setEvents } = useEvents();
  const [form, setForm] = useState({
    title: "",
    college: "",
    venue: "",
    date: "",
    startTime: "",
    endTime: "",
    description: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newEvent = await createEvent(form);
      setEvents((prev) => [...prev, newEvent]); // keep local state in sync
      alert("✅ Event created!");
      setForm({ title: "", college: "", venue: "", date: "", startTime: "", endTime: "", description: "" });
    } catch (err) {
      console.error("❌ Failed to create event", err);
      alert("Could not create event, please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white shadow rounded space-y-4">
      <h2 className="text-xl font-bold">Create Event</h2>
      {Object.keys(form).map((key) => (
        <input
          key={key}
          name={key}
          value={form[key]}
          onChange={handleChange}
          placeholder={key}
          className="border p-2 w-full rounded"
        />
      ))}
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Create
      </button>
    </form>
  );
}
