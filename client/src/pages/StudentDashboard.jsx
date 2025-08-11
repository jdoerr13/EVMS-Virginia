import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEvents } from "../contexts/EventContext";
import { useAuth } from "../contexts/AuthContext";
import { Disclosure, Dialog } from "@headlessui/react";
import {
  ChevronUpIcon,
  CalendarDaysIcon,
  QrCodeIcon,
  MapIcon,
  SpeakerWaveIcon,
  MegaphoneIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import { icsForEvent, download } from "../utils/ics";
import { QRCodeCanvas } from "qrcode.react";

function getStatusClasses(status) {
  switch (status) {
    case "Approved":
      return "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200";
    case "Pending":
      return "bg-amber-100 text-amber-800 ring-1 ring-amber-200";
    case "Closed":
      return "bg-rose-100 text-rose-800 ring-1 ring-rose-200";
    default:
      return "bg-gray-100 text-gray-800 ring-1 ring-gray-200";
  }
}

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { events } = useEvents();
  const { user, logout } = useAuth();
  const today = new Date();

  const [selectedEvent, setSelectedEvent] = useState(null);

  const upcomingEvents = useMemo(() => {
    return events.filter(evt => new Date(evt.date) >= today);
  }, [events, today]);

  return (
    <section className="p-6 space-y-10">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-800">My Student Dashboard</h1>
          <p className="text-zinc-500">Your registered events & passes</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Welcome, {user?.name || 'Student'}</span>
          <button
            onClick={() => navigate("/public")}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Browse All Events
          </button>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </header>

      {/* UPCOMING EVENTS ACCORDION */}
      <div className="bg-white rounded-xl shadow divide-y divide-zinc-200">
        {upcomingEvents.length === 0 ? (
          <p className="p-4 text-gray-500 italic">No upcoming events.</p>
        ) : (
          upcomingEvents.map(evt => (
            <Disclosure key={evt.id}>
              {({ open }) => (
                <>
                  <Disclosure.Button className="w-full flex justify-between items-center p-4 hover:bg-zinc-50">
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClasses(evt.status)}`}>
                        {evt.status}
                      </span>
                      <span className="font-semibold">{evt.title}</span>
                    </div>
                    <ChevronUpIcon
                      className={`w-5 h-5 transition-transform ${open ? "rotate-180" : ""}`}
                    />
                  </Disclosure.Button>

                  <Disclosure.Panel className="px-6 pb-4 space-y-3 bg-zinc-50">
                    <p className="text-sm text-zinc-700"><strong>Venue:</strong> {evt.venue}</p>
                    <p className="text-sm text-zinc-700"><strong>College:</strong> {evt.college}</p>
                    <p className="text-sm text-zinc-700"><strong>Date:</strong> {new Date(evt.date).toLocaleDateString()}</p>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedEvent(evt)}
                        className="flex items-center gap-1 bg-green-600 text-white text-xs px-3 py-1 rounded hover:bg-green-700"
                      >
                        <QrCodeIcon className="w-4 h-4" /> View Pass
                      </button>
                      <button
                        onClick={() => {
                          const text = icsForEvent(evt);
                          const safe = (evt.title || "event").replace(/\s+/g, "-").toLowerCase();
                          download(`${safe}.ics`, text);
                        }}
                        className="flex items-center gap-1 border text-xs px-3 py-1 rounded hover:bg-gray-50"
                      >
                        <CalendarDaysIcon className="w-4 h-4" /> Add to Calendar
                      </button>
                    </div>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          ))
        )}
      </div>

      {/* QUICK RESOURCES */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Resources</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { label: "Meet Speakers", icon: SpeakerWaveIcon, link: "/speakers" },
            { label: "Accessibility", icon: MegaphoneIcon, link: "/accessibility-demo" },
            { label: "Campus Map", icon: MapIcon, link: "#" },
            { label: "My Passes", icon: QrCodeIcon, link: "/passes" },
            { label: "Messages", icon: CalendarDaysIcon, link: "/messages" }
          ].map((res) => (
            <button
              key={res.label}
              onClick={() => navigate(res.link)}
              className="bg-white rounded-lg shadow hover:shadow-md p-4 flex flex-col items-center gap-2 text-sm font-medium text-zinc-700 hover:text-indigo-600"
            >
              <res.icon className="w-6 h-6 text-indigo-600" />
              {res.label}
            </button>
          ))}
        </div>
      </div>

      {/* PASS MODAL */}
      <Dialog open={!!selectedEvent} onClose={() => setSelectedEvent(null)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 space-y-4">
            <div className="flex justify-between items-center">
              <Dialog.Title className="text-lg font-semibold">Event Pass</Dialog.Title>
              <button onClick={() => setSelectedEvent(null)}>
                <XMarkIcon className="w-5 h-5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            {selectedEvent && (
              <>
                <div className="flex flex-col items-center gap-3">
                  <QRCodeCanvas value={`PASS-${selectedEvent.id}`} size={150} />
                  <div className="text-center">
                    <h3 className="font-bold">{selectedEvent.title}</h3>
                    <p className="text-sm text-gray-600">{selectedEvent.venue}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(selectedEvent.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </section>
  );
}
