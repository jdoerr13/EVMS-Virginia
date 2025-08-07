import React from "react";
import CalendarView from "../components/CalendarView";

export default function PublicView() {
  return (
    <section className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Public Event Calendar</h1>

      <div className="bg-white shadow rounded-lg p-6 border border-gray-100">
        <CalendarView />
      </div>
    </section>
  );
}
