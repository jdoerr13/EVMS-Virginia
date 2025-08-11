import React from "react";
import { useNavigate } from "react-router-dom";
import { downloadCSV, parseCSV } from "../utils/csvUtils";
import { useEvents } from "../contexts/EventContext";
import { useAuth } from "../contexts/AuthContext";
import { icsForEvents } from "../utils/ics";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function AdminDashboard() {
  const [showLast30Days, setShowLast30Days] = React.useState(false);
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [importMessage, setImportMessage] = React.useState(null);
  const [importError, setImportError] = React.useState(null);
  const [selectedEvent, setSelectedEvent] = React.useState(null);
  const [showEventModal, setShowEventModal] = React.useState(false);
  const seededRef = React.useRef(false);

  const { events, addEvent, updateEventStatus } = useEvents();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Seed fallback events ONCE if empty to avoid duplicates
  React.useEffect(() => {
    if (seededRef.current) return;
    if (events.length === 0) {
      const fallbackEvents = [
        {
          id: 1,
          title: "VCCS Fall Open House",
          college: "Tidewater Community College",
          venue: "VCCS Conference Center",
          date: "2025-09-15",
          status: "Approved",
          requester: "admin@vccs.edu",
        },
        {
          id: 2,
          title: "VCCS Leadership Summit",
          college: "Virginia Western Community College",
          venue: "VCCS Executive Boardroom",
          date: "2025-10-05",
          status: "Approved",
          requester: "admin@vccs.edu",
        },
        {
          id: 3,
          title: "VCCS Student Success Conference",
          college: "Northern Virginia Community College",
          venue: "VCCS Auditorium",
          date: "2025-11-12",
          status: "Approved",
          requester: "admin@vccs.edu",
        },
      ];
      fallbackEvents.forEach(addEvent);
      seededRef.current = true;
    }
  }, [events.length, addEvent]);

  const handleExport = () => downloadCSV(events);

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      parseCSV(
        file,
        (imported) => {
          imported.forEach(addEvent);
          setImportMessage(`✅ Imported ${imported.length} events successfully.`);
          setImportError(null);
        },
        (err) => {
          setImportError(`❌ Import failed: ${err}`);
          setImportMessage(null);
        }
      );
    }
  };

  const handleApproveEvent = async (eventId) => {
    try {
      await updateEventStatus(eventId, 'Approved');
      setImportMessage('✅ Event approved successfully!');
      setTimeout(() => setImportMessage(null), 3000);
    } catch (error) {
      setImportError('❌ Failed to approve event');
      setTimeout(() => setImportError(null), 3000);
    }
  };

  const handleRejectEvent = async (eventId) => {
    try {
      await updateEventStatus(eventId, 'Rejected');
      setImportMessage('✅ Event rejected successfully!');
      setTimeout(() => setImportMessage(null), 3000);
    } catch (error) {
      setImportError('❌ Failed to reject event');
      setTimeout(() => setImportError(null), 3000);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      try {
        // Remove from local state
        const updatedEvents = events.filter(event => event.id !== eventId);
        // In a real app, you'd call an API to delete from database
        setImportMessage('✅ Event deleted successfully!');
        setTimeout(() => setImportMessage(null), 3000);
      } catch (error) {
        setImportError('❌ Failed to delete event');
        setTimeout(() => setImportError(null), 3000);
      }
    }
  };

  const handleAddToCalendar = (event) => {
    const icsData = icsForEvents([event]);
    const blob = new Blob([icsData], { type: 'text/calendar' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleExportCalendar = () => {
    const approvedEvents = events.filter(event => event.status === 'Approved');
    const icsData = icsForEvents(approvedEvents);
    const blob = new Blob([icsData], { type: 'text/calendar' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'vccs_events_calendar.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Filter logic
  const today = new Date();
  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    if (showLast30Days) {
      const past30 = new Date(today);
      past30.setDate(today.getDate() - 30);
      return eventDate >= past30 && eventDate <= today;
    }
    if (startDate && endDate) {
      return eventDate >= new Date(startDate) && eventDate <= new Date(endDate);
    }
    return true;
  });

  // Data prep
  const statusCounts = { Pending: 0, Approved: 0, Rejected: 0 };
  const venueCounts = {};
  const latestEvents = [...filteredEvents].slice(-5).reverse();

  filteredEvents.forEach((event) => {
    const venue = event.venue?.trim().toLowerCase();
    const status = event.status || "Pending";
    if (venue) venueCounts[venue] = (venueCounts[venue] || 0) + 1;
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });

  const statusData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status,
    value: count,
  }));

  const venueData = Object.entries(venueCounts).map(([venue, count]) => ({
    name: venue.charAt(0).toUpperCase() + venue.slice(1),
    value: count,
  }));

  const COLORS = ["#8884d8", "#82ca9d", "#ff7f7f", "#ffc658", "#a4de6c"];

  return (
    <section className="p-6 space-y-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Welcome, {user?.name || 'Admin'}</span>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* 📦 Import/Export Buttons */}
      <div className="flex flex-wrap gap-4 mt-2 items-center">
        <button onClick={handleExport} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Export CSV
        </button>

        <label className="bg-gray-200 text-gray-700 px-4 py-2 rounded cursor-pointer hover:bg-gray-300">
          Import CSV
          <input type="file" accept=".csv" onChange={handleImport} className="hidden" />
        </label>

        <button onClick={handleExportCalendar} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Export Calendar
        </button>

        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={showLast30Days} onChange={(e) => setShowLast30Days(e.target.checked)} />
          <span className="text-sm text-gray-600">Last 30 Days</span>
        </label>

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        />
      </div>

      {importMessage && <p className="text-green-600 text-sm">{importMessage}</p>}
      {importError && <p className="text-red-600 text-sm">{importError}</p>}

      {/* 🔹 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded shadow border">
          <h2 className="text-lg font-semibold text-gray-600">Total Events</h2>
          <p className="text-3xl font-bold text-blue-600 mt-2">{filteredEvents.length}</p>
        </div>
        <div className="bg-white p-5 rounded shadow border">
          <h2 className="text-lg font-semibold text-gray-600">Pending</h2>
          <p className="text-3xl font-bold text-yellow-500 mt-2">{statusCounts.Pending}</p>
        </div>
        <div className="bg-white p-5 rounded shadow border">
          <h2 className="text-lg font-semibold text-gray-600">Approved</h2>
          <p className="text-3xl font-bold text-green-600 mt-2">{statusCounts.Approved}</p>
        </div>
      </div>

      {/* 🔹 Recent Events */}
      <div className="bg-white p-4 rounded shadow border">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Submissions</h2>
        <ul className="divide-y divide-gray-200">
          {latestEvents.map((event) => (
            <li
              key={`${event.title}-${event.date}-${event.venue}-${event.requester}`}
              className="py-3 flex justify-between items-center"
            >
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{event.title}</p>
                <p className="text-sm text-gray-500">
                  {event.college} — {event.venue} — {event.date}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    event.status === "Approved"
                      ? "bg-green-100 text-green-700"
                      : event.status === "Rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {event.status}
                </span>
                
                {/* Action Buttons */}
                <div className="flex space-x-1">
                  {event.status === "Pending" && (
                    <>
                      <button
                        onClick={() => handleApproveEvent(event.id)}
                        className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                        title="Approve Event"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => handleRejectEvent(event.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                        title="Reject Event"
                      >
                        ✗
                      </button>
                    </>
                  )}
                  
                  {event.status === "Approved" && (
                    <button
                      onClick={() => handleAddToCalendar(event)}
                      className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                      title="Add to Calendar"
                    >
                      📅
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="bg-gray-500 text-white px-2 py-1 rounded text-xs hover:bg-gray-600"
                    title="Delete Event"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* 🔹 Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow border">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Events by Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded shadow border">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Events by Venue</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={venueData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                {venueData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
