// ReviewRequests.jsx
import React from "react";
import { useEvents } from "../contexts/EventContext";

export default function ReviewRequests() {
  const { events, updateEventStatus } = useEvents();

  const pendingRequests = events.filter((event) => event.status === "Pending");

  const handleDecision = (id, decision) => {
    updateEventStatus(id, decision);
  };

  return (
    <section className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Pending Event Requests</h1>

      {pendingRequests.length === 0 ? (
        <p className="text-gray-600">No pending requests at this time.</p>
      ) : (
        <div className="space-y-4">
          {pendingRequests.map((req) => (
            <div
              key={req.id}
              className="bg-white border border-gray-100 shadow rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {req.title}
                </h2>
                <p className="text-sm text-gray-600">
                  {req.venue} — {req.date} — Requested by {req.requester || "N/A"}
                </p>
                <p className="text-sm mt-1 font-semibold text-yellow-600">
                  Status: {req.status}
                </p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleDecision(req.id, "Approved")}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleDecision(req.id, "Rejected")}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
