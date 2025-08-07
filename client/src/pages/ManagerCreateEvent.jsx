// ManagerCreateEvent.jsx
import React from "react";
import EventForm from "../components/EventForm";

const venues = ["Main Hall", "Auditorium", "Gym", "Conference Room"];

export default function ManagerCreateEvent() {
  return (
    <section className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Create Event</h1>

      <div className="bg-white shadow rounded-lg p-6 border border-gray-100">
        <EventForm venues={venues} />
      </div>
    </section>
  );
}
