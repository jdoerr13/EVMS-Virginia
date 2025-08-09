import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEvents } from "../contexts/EventContext";

export default function EmailRegistrants() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const eventId = queryParams.get("eventId");
  const { events } = useEvents();

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [registrants, setRegistrants] = useState([]);
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const evt = events.find(e => String(e.id) === String(eventId));
    if (evt) {
      setEvent(evt);
      setRegistrants(evt.registrations || []);
    }
  }, [eventId, events]);

  const handleSendAll = () => {
    if (!subject || !message) {
      alert("Please enter a subject and message.");
      return;
    }
    alert(`📧 Demo Mode: Would send email to ALL ${registrants.length} registrants for "${event.title}"`);
    setSubject("");
    setMessage("");
  };

  const handleSendIndividual = (registrant) => {
    alert(`📧 Demo Mode: Would send email to ${registrant.name} at ${registrant.email}`);
  };

  if (!event) {
    return (
      <div className="p-6 bg-white shadow rounded-lg">
        <h2 className="text-xl font-bold text-red-600">Event Not Found</h2>
        <button
          onClick={() => navigate("/event-manager")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Event Manager
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow rounded-lg space-y-6">
      <div className="bg-gray-100 text-gray-700 p-3 rounded">
        <strong>Demo Mode:</strong> Emails are not actually sent. Placeholder per RFP.
      </div>

      {/* Event Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Email Registrants – {event.title}</h2>
          <p className="text-gray-600">{event.date} • {event.venue} • {event.college}</p>
        </div>
        <button
          onClick={() => navigate("/event-manager")}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          ← Back
        </button>
      </div>

      {/* Email Form */}
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <textarea
          placeholder="Write your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border p-2 rounded w-full min-h-[150px]"
        />
        <button
          onClick={handleSendAll}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Send Email to All Registrants
        </button>
      </div>

      {/* Registrants Table */}
      <div>
        <h3 className="text-lg font-semibold mt-6 mb-2">Registrant List</h3>
        {registrants.length > 0 ? (
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {registrants.map((r, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="p-2 border">{r.name}</td>
                  <td className="p-2 border">{r.email}</td>
                  <td className="p-2 border">
                    <button
                      onClick={() => handleSendIndividual(r)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Send Email
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No registrants for this event yet.</p>
        )}
      </div>
    </div>
  );
}
