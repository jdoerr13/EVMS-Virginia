// src/pages/InvoiceManager.jsx
import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEvents } from "../contexts/EventContext";

function downloadCSV(rows, filename = "invoices.csv") {
  const headers = [
    "Invoice ID",
    "Event ID",
    "Event",
    "Amount",
    "Due Date",
    "Status",
    "Note",
  ];
  const body = rows.map((r) => [
    r.id,
    r.eventId,
    `"${r.eventTitle}"`,
    r.amount,
    r.dueDate,
    r.status,
    `"${r.note}"`,
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

const currency = (n) =>
  typeof n === "number" ? n.toLocaleString(undefined, { style: "currency", currency: "USD" }) : n;

const StatusBadge = ({ status }) => {
  const style =
    status === "Paid"
      ? "bg-green-100 text-green-800 ring-green-200"
      : status === "Refunded"
      ? "bg-yellow-100 text-yellow-800 ring-yellow-200"
      : "bg-gray-100 text-gray-800 ring-gray-200";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md ring-1 ${style}`}>
      {status}
    </span>
  );
};

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
    <div className="mx-auto max-w-4xl p-6 space-y-6">
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">Invoice Manager</h1>
        <p className="text-sm text-gray-600">
          Create deposit/balance schedules and mark payments for events.
        </p>
      
      </header>

      {/* Event Picker Card (matches Contract) */}
      <section className="bg-white rounded-2xl border shadow-sm p-4 space-y-3">
        <div className="font-semibold">Event</div>
        <select
          value={selectedId}
          onChange={(e) => {
            setSelectedId(e.target.value);
            setInvoices([]);
            applyQueryParam(e.target.value);
          }}
          className="w-full border rounded-lg px-3 py-2"
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
          <div className="text-sm text-gray-700">
            <div className="font-medium">{event.title}</div>
            <div>
              {event.venue} • {event.date}
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-500">
            Choose an event to create a payment schedule.
          </div>
        )}
      </section>

      {/* Actions Card (matches Contract) */}
      <section className="bg-white rounded-2xl border shadow-sm p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={generateSchedule}
            disabled={!event}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Generate Payment Schedule
          </button>
          <button
            onClick={() =>
              downloadCSV(invoices, `invoices-${event?.id || "all"}.csv`)
            }
            disabled={invoices.length === 0}
            className="px-4 py-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50"
          >
            Export CSV
          </button>
      
        </div>
      </section>

      {/* Table Card */}
      <section className="bg-white rounded-2xl border shadow-sm p-4">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="text-left text-sm bg-gray-50">
              <tr>
                <th className="p-2 border-b">Invoice #</th>
                <th className="p-2 border-b">Event</th>
                <th className="p-2 border-b">Amount</th>
                <th className="p-2 border-b">Due</th>
                <th className="p-2 border-b">Status</th>
                <th className="p-2 border-b">Note</th>
                <th className="p-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {invoices.length > 0 ? (
                invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50">
                    <td className="p-2 border-b">{inv.id}</td>
                    <td className="p-2 border-b">{inv.eventTitle}</td>
                    <td className="p-2 border-b">{currency(inv.amount)}</td>
                    <td className="p-2 border-b">{inv.dueDate}</td>
                    <td className="p-2 border-b">
                      <StatusBadge status={inv.status} />
                    </td>
                    <td className="p-2 border-b">{inv.note}</td>
                    <td className="p-2 border-b">
                      <div className="flex gap-2">
                        <button
                          className="text-xs px-2 py-1 rounded-lg border hover:bg-gray-100"
                          onClick={() => setStatus(inv.id, "Paid")}
                        >
                          Mark Paid
                        </button>
                        <button
                          className="text-xs px-2 py-1 rounded-lg border hover:bg-gray-100"
                          onClick={() => setStatus(inv.id, "Refunded")}
                        >
                          Refund
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    className="p-6 text-center text-gray-500"
                    colSpan={7}
                  >
                    No invoices yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
            <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-lg border hover:bg-gray-50"
          >
            ← Back
          </button>
    </div>
  );
}
