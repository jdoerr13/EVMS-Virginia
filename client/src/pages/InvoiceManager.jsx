// src/pages/InvoiceManager.jsx
import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEvents } from "../contexts/EventContext";

function downloadCSV(rows, filename = "invoices.csv") {
  const headers = ["Invoice ID", "Event ID", "Event", "Amount", "Due Date", "Status", "Note"];
  const body = rows.map((r) => [
    r.id, r.eventId, r.eventTitle, r.amount, r.dueDate, r.status, r.note
  ]);
  const csv = [headers, ...body].map((line) => line.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export default function InvoiceManager() {
  const { events } = useEvents();
  const navigate = useNavigate();
  const eventIdParam = new URLSearchParams(useLocation().search).get("eventId");

  const [selectedId, setSelectedId] = useState(eventIdParam || "");
  const event = useMemo(
    () => events.find((e) => String(e.id) === String(selectedId)),
    [events, selectedId]
  );

  const [invoices, setInvoices] = useState([]);

  const generateSchedule = () => {
    if (!event) return alert("Select an event first.");
    const base = Math.max(500, (event.expectedAttendance || 100) * 10); // demo pricing
    const deposit = Math.round(base * 0.25);
    const balance = base - deposit;
    const today = new Date().toISOString().slice(0, 10);
    const due = event.date;

    const rows = [
      {
        id: `${event.id}-1`,
        eventId: event.id,
        eventTitle: event.title,
        amount: deposit,
        status: "Pending",
        note: "25% Deposit",
        dueDate: today,
      },
      {
        id: `${event.id}-2`,
        eventId: event.id,
        eventTitle: event.title,
        amount: balance,
        status: "Pending",
        note: "Balance",
        dueDate: due,
      },
    ];
    setInvoices(rows);
  };

  const setStatus = (id, status) => {
    setInvoices((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
  };

  const applyQueryParam = (id) => {
    const qs = new URLSearchParams();
    if (id) qs.set("eventId", id);
    navigate(`/invoices?${qs.toString()}`, { replace: true });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Invoice Manager</h1>

      {/* Event picker */}
      <div className="bg-gray-50 border rounded p-3">
        <div className="font-semibold mb-1">Event</div>

        <select
          value={selectedId}
          onChange={(e) => {
            setSelectedId(e.target.value);
            setInvoices([]);
            applyQueryParam(e.target.value);
          }}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select an event…</option>
          {events
            .slice()
            .sort((a, b) => String(a.date).localeCompare(String(b.date)))
            .map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.title} • {ev.venue} • {ev.date}
              </option>
            ))}
        </select>

        {event ? (
          <div className="text-sm mt-2">
            {event.title} • {event.venue} • {event.date}
          </div>
        ) : (
          <div className="text-sm text-gray-500 mt-2">
            Choose an event to create a payment schedule.
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={generateSchedule}
          disabled={!event}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Generate Payment Schedule
        </button>
        <button
          onClick={() => downloadCSV(invoices, `invoices-${event?.id || "all"}.csv`)}
          disabled={invoices.length === 0}
          className="px-4 py-2 rounded border disabled:opacity-50"
        >
          Export CSV
        </button>
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Invoice #</th>
            <th className="border p-2">Event</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Due</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Note</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.length > 0 ? (
            invoices.map((inv) => (
              <tr key={inv.id}>
                <td className="border p-2">{inv.id}</td>
                <td className="border p-2">{inv.eventTitle}</td>
                <td className="border p-2">${inv.amount}</td>
                <td className="border p-2">{inv.dueDate}</td>
                <td className="border p-2">{inv.status}</td>
                <td className="border p-2">{inv.note}</td>
                <td className="border p-2">
                  <div className="flex gap-2">
                    <button
                      className="text-xs px-2 py-1 rounded border"
                      onClick={() => setStatus(inv.id, "Paid")}
                    >
                      Mark Paid
                    </button>
                    <button
                      className="text-xs px-2 py-1 rounded border"
                      onClick={() => setStatus(inv.id, "Refunded")}
                    >
                      Refund
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr><td className="p-4 text-center text-gray-500" colSpan="7">No invoices yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
