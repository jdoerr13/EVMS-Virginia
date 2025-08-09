import React, { useState } from "react";

export default function BreakoutSessions() {
  const [sessions, setSessions] = useState([
    {
      id: 1,
      title: "Campus Tour",
      capacity: 40,
      registered: 25,
      speaker: "John Smith",
    },
    {
      id: 2,
      title: "Financial Aid Q&A",
      capacity: 60,
      registered: 45,
      speaker: "Jane Doe",
    },
  ]);

  const [form, setForm] = useState({
    title: "",
    capacity: "",
    speaker: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.title || !form.capacity) {
      alert("Please fill in session title and capacity.");
      return;
    }
    setSessions([
      ...sessions,
      {
        id: sessions.length + 1,
        title: form.title,
        capacity: parseInt(form.capacity),
        registered: 0,
        speaker: form.speaker,
      },
    ]);
    setForm({ title: "", capacity: "", speaker: "" });
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg space-y-6">
      {/* RFP Context */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-sm text-gray-700">
        <p className="font-semibold">This section will manage all breakout sessions within events, including:</p>
        <ul className="list-disc ml-5 mt-2 space-y-1">
          <li>Multiple breakout sessions per event with independent capacities</li>
          <li>Speaker assignment with linked bios and documents</li>
          <li>Real-time registration tracking and capacity enforcement</li>
          <li>Session-specific equipment, staffing, and scheduling</li>
        </ul>
        <p className="mt-2 italic">
          * Per RFP requirements, future phases will include integrated scheduling, public registration, and reporting.
        </p>
      </div>

      {/* Demo Banner */}
      <div className="bg-gray-100 text-gray-700 p-3 rounded">
        <strong>Demo Mode:</strong> Breakout session management is simulated for demo purposes. Data is not saved to a database.
      </div>

      <h2 className="text-2xl font-bold">Breakout Session Manager</h2>

      {/* Add Session Form */}
      <form onSubmit={handleAdd} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium">Session Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="e.g., Keynote Speech"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Capacity</label>
          <input
            type="number"
            name="capacity"
            value={form.capacity}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="e.g., 50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Speaker</label>
          <input
            type="text"
            name="speaker"
            value={form.speaker}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="e.g., Dr. Jane Doe"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Session
        </button>
      </form>

      {/* Session List */}
      <table className="w-full border-collapse mt-6">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Capacity</th>
            <th className="p-2 border">Registered</th>
            <th className="p-2 border">Speaker</th>
            <th className="p-2 border">Progress</th>
          </tr>
        </thead>
        <tbody>
          {sessions.length > 0 ? (
            sessions.map((s) => {
              const percent = Math.min(
                100,
                Math.round((s.registered / s.capacity) * 100)
              );
              return (
                <tr key={s.id}>
                  <td className="p-2 border">{s.title}</td>
                  <td className="p-2 border">{s.capacity}</td>
                  <td className="p-2 border">{s.registered}</td>
                  <td className="p-2 border">{s.speaker}</td>
                  <td className="p-2 border">
                    <div className="w-full bg-gray-200 rounded h-4">
                      <div
                        className={`h-4 rounded ${
                          percent >= 100 ? "bg-red-500" : "bg-green-500"
                        }`}
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600">{percent}% full</span>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="5" className="p-4 text-center text-gray-500">
                No breakout sessions added.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
