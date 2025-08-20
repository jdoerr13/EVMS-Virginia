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
    const base =
      event?.title?.trim().replace(/\s+/g, "-").toLowerCase() || "contract";
    downloadText(`${base}-contract.txt`, preview);
  };

  const applyQueryParam = (id) => {
    const qs = new URLSearchParams();
    if (id) qs.set("eventId", id);
    navigate(`/contracts?${qs.toString()}`, { replace: true });
  };

  return (
    <div className="mx-auto max-w-4xl p-6 space-y-6">
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">Contract Generator</h1>
        <p className="text-sm text-gray-600">
          Pick an event, choose a template, generate a preview, then download.
        </p>
      </header>

      {/* Event Picker Card */}
      <section className="bg-white rounded-2xl border shadow-sm p-4 space-y-3">
        <div className="font-semibold">Event</div>
        <select
          value={selectedId}
          onChange={(e) => {
            setSelectedId(e.target.value);
            applyQueryParam(e.target.value);
            setPreview("");
          }}
          className="w-full border rounded-lg px-3 py-2"
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
          <div className="text-sm text-gray-700">
            <div className="font-medium">{event.title}</div>
            <div>
              {event.college} • {event.venue}
            </div>
            <div>
              {event.date} {event.startTime}-{event.endTime}
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-500">
            Choose an event to merge details into the contract.
          </div>
        )}
      </section>

      {/* Controls + Preview in a consistent grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Controls Card */}
        <div className="bg-white rounded-2xl border shadow-sm p-4 space-y-3">
          <label className="block font-semibold">Select Template</label>
          <select
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            disabled={!event}
          >
            <option>Standard Event Contract</option>
            <option>Venue Rental Agreement</option>
            <option>Speaker Engagement Letter</option>
          </select>

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={generatePreview}
              disabled={!event}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Generate Preview
            </button>
            <button
              onClick={handleDownload}
              disabled={!preview}
              className="px-4 py-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50"
            >
              Download (.txt)
            </button>
            {/* <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded-lg border hover:bg-gray-50"
            >
              ← Back
            </button> */}
          </div>
        </div>

        {/* Preview Card */}
        <div className="bg-white rounded-2xl border shadow-sm p-4">
          <div className="font-semibold mb-2">Preview</div>
          {preview ? (
            <pre className="whitespace-pre-wrap text-sm">{preview}</pre>
          ) : (
            <div className="text-sm text-gray-500">
              No preview yet. Generate one to review it here.
            </div>
          )}
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
