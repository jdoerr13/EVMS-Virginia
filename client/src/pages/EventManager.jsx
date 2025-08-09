import React, { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useEvents } from "../contexts/EventContext";

export default function EventManager() {
  const navigate = useNavigate();
  const { events, updateEventStatus } = useEvents();
  const [filterStatus, setFilterStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedEventId, setSelectedEventId] = useState(null);

  const pending = useMemo(
    () => events.filter((e) => e.status === "Pending"),
    [events]
  );

  const conflictsThisWeek = useMemo(() => {
    const now = new Date();
    const day = now.getDay();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - ((day + 6) % 7));
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    const withinWeek = events.filter((e) => {
      if (!e.date) return false;
      const d = new Date(e.date);
      return d >= weekStart && d < weekEnd;
    });

    const byKey = new Map();
    withinWeek.forEach((e) => {
      const key = `${(e.venue || "").trim().toLowerCase()}__${e.date}`;
      if (!byKey.has(key)) byKey.set(key, []);
      byKey.get(key).push(e);
    });

    function overlaps(a, b) {
      if (!a.startTime || !a.endTime || !b.startTime || !b.endTime) return false;
      const toMin = (t) => {
        const [h, m] = t.split(":").map(Number);
        return h * 60 + m;
      };
      const aStart = toMin(a.startTime), aEnd = toMin(a.endTime);
      const bStart = toMin(b.startTime), bEnd = toMin(b.endTime);
      return aStart < bEnd && bStart < aEnd;
    }

    const conflicts = [];
    byKey.forEach((list) => {
      const pairs = [];
      for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
          if (overlaps(list[i], list[j])) pairs.push([list[i], list[j]]);
        }
      }
      if (pairs.length > 0) {
        conflicts.push({
          id: `${list[0].venue}-${list[0].date}`,
          venue: list[0].venue,
          date: list[0].date,
          count: new Set(pairs.flat().map((e) => e.id)).size,
          events: Array.from(new Set(pairs.flat())),
        });
      }
    });
    return conflicts;
  }, [events]);

  const filteredEvents = events.filter((event) => {
    const matchesStatus = filterStatus === "All" || event.status === filterStatus;
    const q = search.toLowerCase();
    const matchesSearch =
      event.title.toLowerCase().includes(q) ||
      event.college.toLowerCase().includes(q) ||
      event.venue.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const selectedEvent = selectedEventId
    ? events.find((e) => String(e.id) === String(selectedEventId))
    : null;

  const gotoContract = () => {
    if (!selectedEvent) return;
    navigate(`/contracts?eventId=${selectedEvent.id}`);
  };
  const gotoInvoices = () => {
    if (!selectedEvent) return;
    navigate(`/invoices?eventId=${selectedEvent.id}`);
  };
  const gotoEmailRegistrants = () => {
  if (!selectedEvent) return;
  navigate(`/email-registrants?eventId=${selectedEvent.id}`);
};

  return (
    <div className="p-6 bg-white shadow rounded-lg space-y-6">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Event Manager</h2>

        {/* Shortcuts use selectedEventId */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate("/manager/create")}
            className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Create Event
          </button>

          <button
            onClick={gotoContract}
            disabled={!selectedEvent}
            className="px-3 py-2 rounded border disabled:opacity-50"
            title={!selectedEvent ? "Select an event row first" : "Generate contract for selected"}
          >
            Generate Contract
          </button>

          <button
            onClick={gotoInvoices}
            disabled={!selectedEvent}
            className="px-3 py-2 rounded border disabled:opacity-50"
            title={!selectedEvent ? "Select an event row first" : "Create invoices for selected"}
          >
            Create Invoice
          </button>

        <button
          onClick={gotoEmailRegistrants}
          disabled={!selectedEvent}
          className="px-3 py-2 rounded border disabled:opacity-50"
          title={!selectedEvent ? "Select an event row first" : "Email registrants for selected"}
        >
          Email Registrants
        </button>
        </div>
      </header>

      {/* Selection hint */}
      <div className="text-sm text-gray-600">
        {selectedEvent ? (
          <>Selected: <span className="font-medium">{selectedEvent.title}</span> ({selectedEvent.date})</>
        ) : (
          <>Tip: click a row to select an event for the actions above.</>
        )}
      </div>

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
                <tr
                  key={e.id}
                  className={`hover:bg-gray-50 cursor-pointer ${selectedEventId === e.id ? "bg-blue-50" : ""}`}
                  onClick={() => setSelectedEventId(e.id)}
                >
                  <td className="p-2 border">{e.title}</td>
                  <td className="p-2 border">{e.venue}</td>
                  <td className="p-2 border">{e.date}</td>
                  <td className="p-2 border">{e.requester || "N/A"}</td>
                  <td className="p-2 border space-x-2">
                    <button
                      onClick={(ev) => { ev.stopPropagation(); updateEventStatus(e.id, "Approved"); }}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={(ev) => { ev.stopPropagation(); updateEventStatus(e.id, "Rejected"); }}
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

      {/* Filters */}
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

      {/* Main table */}
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
              <tr
                key={event.id}
                className={`hover:bg-gray-50 cursor-pointer ${selectedEventId === event.id ? "bg-blue-50" : ""}`}
                onClick={() => setSelectedEventId(event.id)}
              >
                <td className="p-2 border">{event.title}</td>
                <td className="p-2 border">{event.college}</td>
                <td className="p-2 border">{event.venue}</td>
                <td className="p-2 border">{event.date}</td>
                <td className="p-2 border">{event.status}</td>
                <td className="p-2 border">
                  <div className="flex flex-wrap gap-2">
                    {event.status === "Pending" && (
                      <>
                        <button
                          onClick={(ev) => { ev.stopPropagation(); updateEventStatus(event.id, "Approved"); }}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={(ev) => { ev.stopPropagation(); updateEventStatus(event.id, "Rejected"); }}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    <button
                      onClick={(ev) => { ev.stopPropagation(); navigate(`/contracts?eventId=${event.id}`); }}
                      className="px-3 py-1 rounded border"
                      title="Generate contract for this event"
                    >
                      Contract
                    </button>

                    <button
                      onClick={(ev) => { ev.stopPropagation(); navigate(`/invoices?eventId=${event.id}`); }}
                      className="px-3 py-1 rounded border"
                      title="Create invoices for this event"
                    >
                      Invoices
                    </button>
                  </div>
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
