// src/pages/EventManager.jsx
import React, { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useEvents } from "../contexts/EventContext";

export default function EventManager() {
  const navigate = useNavigate();
  const { events, updateEventStatus } = useEvents();
  const [filterStatus, setFilterStatus] = useState("All");
  const [search, setSearch] = useState("");

  // --- Pending queue
  const pending = useMemo(
    () => events.filter((e) => e.status === "Pending"),
    [events]
  );

  // --- Conflicts this week (same venue + same date, between Mon–Sun of current week)
  const conflictsThisWeek = useMemo(() => {
    const now = new Date();
    const day = now.getDay(); // 0 Sun .. 6 Sat
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - ((day + 6) % 7)); // Monday
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    const withinWeek = events.filter((e) => {
      if (!e.date) return false;
      const d = new Date(e.date);
      return d >= weekStart && d < weekEnd;
    });

    const byKey = new Map(); // key = `${venue}__${date}`
    withinWeek.forEach((e) => {
      const key = `${(e.venue || "").trim().toLowerCase()}__${e.date}`;
      if (!byKey.has(key)) byKey.set(key, []);
      byKey.get(key).push(e);
    });

    const conflicts = [];
    byKey.forEach((list) => {
      if (list.length > 1) {
        // push one record representing the conflict group
        conflicts.push({
          id: `${list[0].venue}-${list[0].date}`,
          venue: list[0].venue,
          date: list[0].date,
          count: list.length,
          events: list,
        });
      }
    });
    return conflicts;
  }, [events]);

  // --- Filters for the main table (unchanged)
  const filteredEvents = events.filter((event) => {
    const matchesStatus = filterStatus === "All" || event.status === filterStatus;
    const q = search.toLowerCase();
    const matchesSearch =
      event.title.toLowerCase().includes(q) ||
      event.college.toLowerCase().includes(q) ||
      event.venue.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-6 bg-white shadow rounded-lg space-y-6">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Event Manager</h2>

        {/* Shortcuts */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate("/manager/create")}
            className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Create Event
          </button>
          <button
            onClick={() => navigate("/contracts")}
            className="px-3 py-2 rounded border"
          >
            Generate Contract
          </button>
          <button
            onClick={() => navigate("/invoices")}
            className="px-3 py-2 rounded border"
          >
            Create Invoice
          </button>
          <button
            onClick={() => navigate("/registration")}
            className="px-3 py-2 rounded border"
          >
            Email Registrants
          </button>
        </div>
      </header>

      {/* Summary tiles */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded p-4">
          <div className="text-sm text-gray-600">Pending Requests</div>
          <div className="text-3xl font-bold mt-1">{pending.length}</div>
          <Link to="/admin/requests" className="text-blue-700 underline text-sm mt-2 inline-block">
            Review queue →
          </Link>
        </div>

        <div className="border rounded p-4">
          <div className="text-sm text-gray-600">Conflicts this week</div>
          <div className="text-3xl font-bold mt-1">{conflictsThisWeek.length}</div>
          {conflictsThisWeek.length > 0 && (
            <div className="text-xs text-gray-600 mt-2">
              {conflictsThisWeek.slice(0, 2).map((c) => (
                <div key={c.id}>
                  {c.date} — {c.venue} ({c.count})
                </div>
              ))}
              {conflictsThisWeek.length > 2 && <div>+ more…</div>}
            </div>
          )}
        </div>

        <div className="border rounded p-4">
          <div className="text-sm text-gray-600">Total Events</div>
          <div className="text-3xl font-bold mt-1">{events.length}</div>
          <div className="text-xs text-gray-600 mt-2">
            Approved: {events.filter((e) => e.status === "Approved").length} • Rejected:{" "}
            {events.filter((e) => e.status === "Rejected").length}
          </div>
        </div>
      </section>

      {/* Pending slice */}
      <section className="border rounded p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Pending (quick actions)</h3>
          <Link to="/admin/requests" className="text-sm text-blue-700 underline">
            Open full queue
          </Link>
        </div>
        {pending.length === 0 ? (
          <p className="text-gray-500 text-sm">No pending requests.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Title</th>
                <th className="p-2 border">Venue</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Requester</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pending.slice(0, 5).map((e) => (
                <tr key={e.id} className="hover:bg-gray-50">
                  <td className="p-2 border">{e.title}</td>
                  <td className="p-2 border">{e.venue}</td>
                  <td className="p-2 border">{e.date}</td>
                  <td className="p-2 border">{e.requester || "N/A"}</td>
                  <td className="p-2 border space-x-2">
                    <button
                      onClick={() => updateEventStatus(e.id, "Approved")}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateEventStatus(e.id, "Rejected")}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Existing filters */}
      <div className="flex flex-wrap gap-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>

        <input
          type="text"
          placeholder="Search by title, college, or venue..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded flex-1 min-w-[200px]"
        />
      </div>

      {/* Existing main table (unchanged) */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Title</th>
            <th className="p-2 border">College</th>
            <th className="p-2 border">Venue</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <tr key={event.id} className="hover:bg-gray-50">
                <td className="p-2 border">{event.title}</td>
                <td className="p-2 border">{event.college}</td>
                <td className="p-2 border">{event.venue}</td>
                <td className="p-2 border">{event.date}</td>
                <td className="p-2 border">{event.status}</td>
                <td className="p-2 border space-x-2">
                  {event.status === "Pending" && (
                    <>
                      <button
                        onClick={() => updateEventStatus(event.id, "Approved")}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateEventStatus(event.id, "Rejected")}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="p-4 text-center text-gray-500">
                No events found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
