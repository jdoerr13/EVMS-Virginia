// src/pages/ContractGenerator.jsx
import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEvents } from "../contexts/EventContext";

function downloadText(filename, text) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export default function ContractGenerator() {
  const { events } = useEvents();
  const navigate = useNavigate();
  const eventIdParam = new URLSearchParams(useLocation().search).get("eventId");

  const [selectedId, setSelectedId] = useState(eventIdParam || "");
  const event = useMemo(
    () => events.find((e) => String(e.id) === String(selectedId)),
    [events, selectedId]
  );

  const [template, setTemplate] = useState("Standard Event Contract");
  const [preview, setPreview] = useState("");

  const generatePreview = () => {
    const e = event;
    const client = e?.requester || "Client Contact";
    const lines = [
      `CONTRACT: ${template}`,
      `DATE GENERATED: ${new Date().toLocaleString()}`,
      "",
      `EVENT: ${e?.title || "Untitled"}`,
      `COLLEGE: ${e?.college || ""}`,
      `VENUE: ${e?.venue || ""}`,
      `DATE/TIME: ${e?.date || ""} ${e?.startTime || ""}-${e?.endTime || ""}`,
      `EXPECTED ATTENDANCE: ${e?.expectedAttendance ?? "N/A"}`,
      "",
      `CLIENT EMAIL: ${client}`,
      "",
      "TERMS & CONDITIONS (DEMO):",
      "1) Deposit: 25% due upon execution.",
      "2) Balance: Due 7 days prior to event.",
      "3) Cancellation: 50% after 14 days; 100% within 72 hours.",
      "4) Client provides insurance certificates where required.",
      "",
      "SIGNATURES:",
      "Provider: ____________________   Date: ____________",
      "Client:   ____________________   Date: ____________",
    ];
    setPreview(lines.join("\n"));
  };

  const handleDownload = () => {
    if (!preview) return;
    const base = event?.title?.trim().replace(/\s+/g, "-").toLowerCase() || "contract";
    downloadText(`${base}-contract.txt`, preview);
  };

  const applyQueryParam = (id) => {
    const qs = new URLSearchParams();
    if (id) qs.set("eventId", id);
    navigate(`/contracts?${qs.toString()}`, { replace: true });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Contract Generator</h1>

      {/* Event picker if no query param or for switching */}
      <div className="bg-gray-50 border rounded p-3 space-y-2">
        <div className="font-semibold">Event</div>
        <select
          value={selectedId}
          onChange={(e) => {
            setSelectedId(e.target.value);
            applyQueryParam(e.target.value);
            setPreview("");
          }}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select an event…</option>
          {events
            .slice()
            .sort((a, b) => String(a.date).localeCompare(String(b.date)))
            .map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.title} — {ev.venue} — {ev.date}
              </option>
            ))}
        </select>

        {event ? (
          <div className="text-sm">
            <div>{event.title}</div>
            <div>{event.college} • {event.venue}</div>
            <div>{event.date} {event.startTime}-{event.endTime}</div>
          </div>
        ) : (
          <div className="text-sm text-gray-500">
            Choose an event to merge details into the contract.
          </div>
        )}
      </div>

      <div className="space-y-3">
        <label className="block font-semibold">Select Template</label>
        <select
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          className="w-full border rounded px-3 py-2"
          disabled={!event}
        >
          <option>Standard Event Contract</option>
          <option>Venue Rental Agreement</option>
          <option>Speaker Engagement Letter</option>
        </select>

        <div className="flex gap-2">
          <button
            onClick={generatePreview}
            disabled={!event}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Generate Preview
          </button>
          <button
            onClick={handleDownload}
            disabled={!preview}
            className="px-4 py-2 rounded border disabled:opacity-50"
          >
            Download (.txt)
          </button>
        </div>
      </div>

      {preview && (
        <pre className="mt-2 border rounded p-4 bg-white whitespace-pre-wrap text-sm">
          {preview}
        </pre>
      )}
    </div>
  );
}
