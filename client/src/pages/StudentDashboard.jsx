import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Disclosure, Dialog } from "@headlessui/react";
import { CalendarIcon } from "@heroicons/react/24/solid";
import {
  ChevronUpIcon,
  CalendarDaysIcon,
  QrCodeIcon,
  MapIcon,
  SpeakerWaveIcon,
  MegaphoneIcon,
  XMarkIcon,
  ArrowPathIcon,
  BellIcon,
  StarIcon,
  VideoCameraIcon,
  DocumentArrowDownIcon,
  BookmarkIcon,
  EnvelopeIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";
import { icsForEvent, download } from "../utils/ics";
import { QRCodeCanvas } from "qrcode.react";
import { getRegistrations, getEvents } from "../utils/api";

function getStatusClasses(status) {
  switch (status?.toLowerCase()) {
    case "approved":
    case "confirmed":
      return "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200";
    case "pending":
      return "bg-amber-100 text-amber-800 ring-1 ring-amber-200";
    case "closed":
    case "cancelled":
      return "bg-rose-100 text-rose-800 ring-1 ring-rose-200";
    default:
      return "bg-gray-100 text-gray-800 ring-1 ring-gray-200";
  }
}

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // --- mock UI state (append-only) ---
  const [showNotif, setShowNotif] = useState(false);
  const [showFeedbackFor, setShowFeedbackFor] = useState(null);
  const [feedbackStars, setFeedbackStars] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");

  const [showSyncModal, setShowSyncModal] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const [recommended, setRecommended] = useState([]); // from API only
  const [favorites, setFavorites] = useState(() => new Set()); // client-side mock
  // Phase 2 modal state (ADD)
  const [phase2Open, setPhase2Open] = useState(false);
  const [phase2Feature, setPhase2Feature] = useState("");
  const openPhase2 = (name) => { setPhase2Feature(name); setPhase2Open(true); };
  // -----------------------------------

  useEffect(() => {
    const studentId = 3; // 🔒 always demo student

    (async () => {
      try {
        const { data: regs } = await getRegistrations(studentId);
        const { data: evts } = await getEvents();

        // Merge registrations with events (fallback to minimal values ONLY if event not found)
        const merged = regs.map((r) => {
          const evt = evts.find((e) => e.id === r.event_id);
          return {
            ...evt,
            event_id: r.event_id,
            registration_id: r.id,
            reg_status: r.status,
            title: evt?.title || `(Event #${r.event_id})`,
            venue: evt?.venue || "TBD",
            date: evt?.date || r.created_at,
            status: evt?.status || "Approved",
            college: evt?.college || "",
          };
        });

        // Deduplicate by event + venue + date
        const uniq = Array.from(
          new Map(merged.map((e) => [`${e.event_id}-${e.venue}-${e.date}`, e])).values()
        );

        setRegistrations(uniq);

        // Recommended (from API only; no mock insertion)
        const registeredIds = new Set(uniq.map((u) => u.event_id || u.id));
        const upcoming = (evts || []).filter((e) => !registeredIds.has(e.id)).slice(0, 3);
        setRecommended(upcoming);
      } catch (err) {
        console.warn("StudentDashboard load failed:", err);
        // IMPORTANT: Do NOT inject mock events or registrations.
        setRegistrations([]);
        setRecommended([]);
      }
    })();
  }, []);

  // --- helpers (append-only) ---
  const notifications = [
    { id: 1, text: "Room change for Career Fair: now in Exhibit Hall B.", time: "5m ago" },
    { id: 2, text: "Orientation check‑in opens 15 minutes early.", time: "1h ago" },
    { id: 3, text: "Speaker lineup updated for Tech Expo.", time: "Yesterday" },
  ];

  function downloadRegistrationCSV(rows = []) {
    const header = ["Title", "Venue", "Date", "Status"];
    const csv = [
      header.join(","),
      ...rows.map((r) =>
        [
          JSON.stringify(r.title || ""),
          JSON.stringify(r.venue || ""),
          JSON.stringify(r.date ? new Date(r.date).toLocaleDateString() : ""),
          JSON.stringify(r.reg_status || ""),
        ].join(",")
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const today = new Date().toISOString().slice(0, 10);
    a.download = `my-registrations-${today}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function buildICSFromRegs(regs = []) {
    const formatDate = (ymd) => (ymd || "").replaceAll("-", "");
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const dtstamp = `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(
      now.getUTCDate()
    )}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`;

    const vevents = regs
      .map((evt, i) => {
        const uid = `evt-${evt.event_id || evt.id || i}@evms.mock`;
        const dtstart = formatDate(evt.date);
        const summary = (evt.title || "Event").replace(/\n/g, " ");
        const location = (evt.venue || "").replace(/\n/g, " ");
        return [
          "BEGIN:VEVENT",
          `UID:${uid}`,
          `DTSTAMP:${dtstamp}`,
          `DTSTART;VALUE=DATE:${dtstart}`,
          `SUMMARY:${summary}`,
          location ? `LOCATION:${location}` : "",
          `DESCRIPTION:Registration status: ${evt.reg_status || "confirmed"}`,
          "END:VEVENT",
        ]
          .filter(Boolean)
          .join("\n");
      })
      .join("\n");

    return [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//EVMS//Student Sync//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      vevents,
      "END:VCALENDAR",
    ].join("\n");
  }

  async function handleMockSync() {
    try {
      setIsSyncing(true);
      const ics = buildICSFromRegs(registrations);
      const today = new Date().toISOString().slice(0, 10);
      download(`my-evms-events-${today}.ics`, ics);
      setShowSyncModal(true);
    } finally {
      setIsSyncing(false);
    }
  }

  function toggleFavorite(id) {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // Past events (from real registrations only)
  const pastEvents = registrations.filter((r) => {
    if (!r.date) return false;
    const d = new Date(r.date);
    const today = new Date();
    // compare date only:
    return d.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0);
  });
  // ------------------------------
  const [showPast, setShowPast] = useState(false);

  const mockPastEvents = [
    {
      id: "m1",
      title: "Campus Basketball Championship",
      date: "Feb 20, 2024",
      venue: "Main Sports Arena",
    },
    {
      id: "m2",
      title: "Spring Music Festival",
      date: "Apr 15, 2024",
      venue: "Outdoor Pavilion",
    },
    {
      id: "m3",
      title: "Theater Night: Hamlet",
      date: "May 5, 2024",
      venue: "College Auditorium",
    },
    {
      id: "m4",
      title: "Tech & Innovation Expo",
      date: "Sept 10, 2024",
      venue: "Technology Hall",
    },
  ];
  return (
    <section className="p-6 space-y-10 bg-gray-50 min-h-screen">
      {/* Header (kept, with additions) */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          {/* Notifications bell (mock) */}
          <button
            type="button"
            onClick={() => setShowNotif(true)}
            className="relative bg-white border px-3 py-2 rounded-lg hover:bg-zinc-50"
            title="Notifications"
          >
            <BellIcon className="w-5 h-5 text-zinc-700" />
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 text-[10px] rounded-full bg-rose-500 text-white">
              3
            </span>
          </button>

          <div>
            <h1 className="text-3xl font-bold text-zinc-800">My Student Dashboard</h1>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate("/public")}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Browse All Events
          </button>

          {/* Mock “Sync to Google” action */}
          <button
            onClick={() =>
              alert("🔗 Mock sync: your events would be synced to Google Calendar here.")
            }
            className="flex items-center gap-2 bg-white border px-4 py-2 rounded-lg text-sm text-zinc-700 hover:bg-zinc-50"
          >
            <CalendarIcon className="w-5 h-5 text-red-500" />
            Sync to Google
          </button>

          {/* Realistic bulk .ics export */}
          <button
            onClick={handleMockSync}
            className="flex items-center gap-2 bg-white border px-4 py-2 rounded-lg text-sm text-zinc-700 hover:bg-zinc-50"
            title="Download .ics for bulk import to Google/Apple/Outlook"
          >
            <ArrowPathIcon className={`w-5 h-5 ${isSyncing ? "animate-spin" : ""}`} />
            Sync events (.ics)
          </button>
        </div>
      </header>

      {/* Accordion for registrations (kept) */}
      <h2 className="text-2xl font-semibold text-zinc-800 mb-4">
        Your registered events & passes
      </h2>
      <div className="bg-white rounded-xl shadow divide-y divide-zinc-200">
        {registrations.length === 0 ? (
          <p className="p-4 text-gray-500 italic">No upcoming events.</p>
        ) : (
          registrations.map((evt) => (
            <Disclosure key={evt.registration_id || evt.id}>
              {({ open }) => (
                <>
                  <Disclosure.Button className="w-full flex justify-between items-center p-4 hover:bg-zinc-50">
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClasses(
                          evt.reg_status
                        )}`}
                      >
                        {evt.reg_status}
                      </span>
                      <span className="font-semibold">{evt.title}</span>
                    </div>
                    <ChevronUpIcon
                      className={`w-5 h-5 transition-transform ${open ? "rotate-180" : ""}`}
                    />
                  </Disclosure.Button>

                  <Disclosure.Panel className="px-6 pb-4 space-y-3 bg-zinc-50">
                    <p className="text-sm text-zinc-700">
                      <strong>Venue:</strong> {evt.venue}
                    </p>
                    <p className="text-sm text-zinc-700">
                      <strong>Date:</strong>{" "}
                      {evt.date ? new Date(evt.date).toLocaleDateString() : "TBD"}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedEvent(evt)}
                        className="flex items-center gap-1 bg-green-600 text-white text-xs px-3 py-1 rounded hover:bg-green-700"
                      >
                        <QrCodeIcon className="w-4 h-4" /> View Pass
                      </button>

                      <button
                        onClick={() => {
                          const text = icsForEvent(evt);
                          const safe = (evt.title || "event")
                            .replace(/\s+/g, "-")
                            .toLowerCase();
                          download(`${safe}.ics`, text);
                        }}
                        className="flex items-center gap-1 border text-xs px-3 py-1 rounded hover:bg-gray-50"
                      >
                        <CalendarDaysIcon className="w-4 h-4" /> Add to Calendar
                      </button>

                      {/* “Join Online” mock */}
                      <button
                        onClick={() => alert("🎥 Mock: joining live stream...")}
                        className="flex items-center gap-1 border text-xs px-3 py-1 rounded hover:bg-gray-50"
                      >
                        <VideoCameraIcon className="w-4 h-4" /> Join Online
                      </button>

                      {/* Feedback mock */}
                      <button
                        onClick={() => {
                          setShowFeedbackFor(evt);
                          setFeedbackStars(0);
                          setFeedbackText("");
                        }}
                        className="flex items-center gap-1 border text-xs px-3 py-1 rounded hover:bg-gray-50"
                      >
                        <StarIcon className="w-4 h-4" /> Leave Feedback
                      </button>

                      {/* Resend confirmation (mock) */}
                      <button
                        onClick={() => alert("📨 Mock: confirmation email resent!")}
                        className="flex items-center gap-1 border text-xs px-3 py-1 rounded hover:bg-gray-50"
                      >
                        <EnvelopeIcon className="w-4 h-4" /> Resend Email
                      </button>

                      {/* Save/Favorite (client-side mock) */}
                      <button
                        onClick={() => toggleFavorite(evt.event_id || evt.id)}
                        className={`flex items-center gap-1 border text-xs px-3 py-1 rounded hover:bg-gray-50 ${
                          favorites.has(evt.event_id || evt.id) ? "bg-amber-50" : ""
                        }`}
                        title="Save to Favorites"
                      >
                        <BookmarkIcon className="w-4 h-4" />
                        {favorites.has(evt.event_id || evt.id) ? "Saved" : "Save"}
                      </button>
                    </div>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          ))
        )}
      </div>


      {/* --- Mock Past Events Dropdown --- */}
      <div className="bg-white rounded-xl shadow">
        <button
          onClick={() => setShowPast(!showPast)}
          className="w-full text-left px-4 py-3 font-bold text-xl text-zinc-700 flex justify-between items-center"
        >
          Past Events You Attended
          <span className="ml-2 text-zinc-500">
            {showPast ? "▲" : "▼"}
          </span>
        </button>

        {showPast && (
          <div className="divide-y divide-zinc-200">
            {mockPastEvents.map((evt) => (
              <div key={evt.id} className="p-4">
                <p className="font-medium">{evt.title}</p>
                <p className="text-sm text-gray-500">
                  {evt.date} · {evt.venue}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>


      {/* My Tools (new) */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-xl font-semibold mb-3">My Tools</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => downloadRegistrationCSV(registrations)}
            className="flex items-center gap-2 px-3 py-2 rounded border hover:bg-gray-50 text-sm"
            title="Download a CSV summary of your registrations"
          >
            <DocumentArrowDownIcon className="w-5 h-5" />
            Export Registration Summary (CSV)
          </button>

          <button
            onClick={() => setShowNotif(true)}
            className="flex items-center gap-2 px-3 py-2 rounded border hover:bg-gray-50 text-sm"
            title="Open notifications"
          >
            <BellIcon className="w-5 h-5" />
            Open Notifications
          </button>
        </div>
      </div>






{/* Quick resources (kept) */}
<div>
  <h2 className="text-xl font-semibold mb-4">Quick Resources</h2>
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
    {[
      { label: "Meet Speakers", icon: SpeakerWaveIcon, link: "/speakers", comingSoon: false },
      { label: "Accessibility", icon: MegaphoneIcon, link: "/accessibility-demo", comingSoon: false },

      // These four trigger the Phase 2 modal (per your request)
      { label: "Campus Map", icon: MapIcon, link: "#", comingSoon: true },
      { label: "My Passes", icon: QrCodeIcon, link: "/passes", comingSoon: true },
      { label: "Messages", icon: CalendarDaysIcon, link: "/messages", comingSoon: true },
      { label: "Sync Class Schedule", icon: ArrowPathIcon, link: "#", comingSoon: true },
    ].map((res) => (
      <button
        key={res.label}
        onClick={() => res.comingSoon ? openPhase2(res.label) : navigate(res.link)}
        className="bg-white rounded-lg shadow hover:shadow-md p-4 flex flex-col items-center gap-2 text-sm font-medium text-zinc-700 hover:text-indigo-600"
      >
        <res.icon className="w-6 h-6 text-indigo-600" />
        {res.label}
      </button>
    ))}
  </div>
</div>

      {/* Recommended for You — from API only (kept) */}
      {recommended && recommended.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Recommended for You</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommended.map((e) => (
              <div key={e.id} className="bg-white rounded-lg shadow p-4 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{e.title}</h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getStatusClasses(e.status)}`}
                  >
                    {e.status || "Approved"}
                  </span>
                </div>
                <p className="text-sm text-zinc-600">📍 {e.venue || "TBD"}</p>
                <p className="text-xs text-zinc-500">
                  📅 {e.date ? new Date(e.date).toLocaleDateString() : "TBD"} • 🎓{" "}
                  {e.college || "VCCS"}
                </p>
                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => alert("✅ Mock: registered!")}
                    className="bg-indigo-600 text-white text-xs px-3 py-1 rounded hover:bg-indigo-700"
                  >
                    Quick Register
                  </button>
                  <button
                    onClick={() => toggleFavorite(e.id)}
                    className={`border text-xs px-3 py-1 rounded hover:bg-gray-50 ${
                      favorites.has(e.id) ? "bg-amber-50" : ""
                    }`}
                  >
                    <BookmarkIcon className="w-4 h-4 inline mr-1" />
                    {favorites.has(e.id) ? "Saved" : "Save"}
                  </button>
                  <button
                    onClick={() => navigate("/public")}
                    className="border text-xs px-3 py-1 rounded hover:bg-gray-50"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Saved (Favorites) — client-side mock */}
      {favorites.size > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Saved Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...favorites].map((fid) => {
              const fromRegs = registrations.find((e) => (e.event_id || e.id) === fid);
              const fromRecs = recommended.find((e) => e.id === fid);
              const e = fromRegs || fromRecs;
              if (!e) return null;
              return (
                <div key={fid} className="bg-white rounded-lg shadow p-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{e.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusClasses(e.status)}`}>
                      {e.status || "Saved"}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-600">📍 {e.venue || "TBD"}</p>
                  <p className="text-xs text-zinc-500">
                    📅 {e.date ? new Date(e.date).toLocaleDateString() : "TBD"}
                  </p>
                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => toggleFavorite(fid)}
                      className="border text-xs px-3 py-1 rounded hover:bg-gray-50"
                    >
                      Remove
                    </button>
                    <button
                      onClick={() => navigate("/public")}
                      className="border text-xs px-3 py-1 rounded hover:bg-gray-50"
                    >
                      View
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Past Events (from real registrations only) */}
      {pastEvents.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Past Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pastEvents.map((e) => (
              <div key={`past-${e.registration_id || e.id}`} className="bg-white rounded-lg shadow p-4 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{e.title}</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 ring-1 ring-gray-200">
                    Past
                  </span>
                </div>
                <p className="text-sm text-zinc-600">📍 {e.venue || "TBD"}</p>
                <p className="text-xs text-zinc-500">
                  📅 {e.date ? new Date(e.date).toLocaleDateString() : "TBD"}
                </p>
                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => {
                      setShowFeedbackFor(e);
                      setFeedbackStars(0);
                      setFeedbackText("");
                    }}
                    className="border text-xs px-3 py-1 rounded hover:bg-gray-50"
                  >
                    <StarIcon className="w-4 h-4 inline mr-1" />
                    Leave Feedback
                  </button>
                  <button
                    onClick={() => alert("🏅 Mock: certificate downloaded!")}
                    className="border text-xs px-3 py-1 rounded hover:bg-gray-50"
                    title="Download Attendance Certificate (mock)"
                  >
                    <CheckBadgeIcon className="w-4 h-4 inline mr-1" />
                    Download Certificate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pass modal (kept) */}
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
              <div className="flex flex-col items-center gap-3">
                <QRCodeCanvas value={`PASS-${selectedEvent.registration_id}`} size={150} />
                <div className="text-center">
                  <h3 className="font-bold">{selectedEvent.title}</h3>
                  <p className="text-sm text-gray-600">{selectedEvent.venue}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(selectedEvent.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Notifications modal (new) */}
      <Dialog open={showNotif} onClose={() => setShowNotif(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center">
              <Dialog.Title className="text-lg font-semibold">Notifications</Dialog.Title>
              <button onClick={() => setShowNotif(false)}>
                <XMarkIcon className="w-5 h-5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            <ul className="space-y-2">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className="p-3 rounded border bg-zinc-50 flex items-center justify-between"
                >
                  <span className="text-sm text-zinc-700">{n.text}</span>
                  <span className="text-xs text-zinc-400">{n.time}</span>
                </li>
              ))}
            </ul>
            <div className="text-right">
              <button
                onClick={() => setShowNotif(false)}
                className="px-4 py-2 rounded border hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Feedback modal (new) */}
      <Dialog
        open={!!showFeedbackFor}
        onClose={() => setShowFeedbackFor(null)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center">
              <Dialog.Title className="text-lg font-semibold">
                Leave Feedback {showFeedbackFor ? `— ${showFeedbackFor.title}` : ""}
              </Dialog.Title>
              <button onClick={() => setShowFeedbackFor(null)}>
                <XMarkIcon className="w-5 h-5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setFeedbackStars(n)}
                    className={`p-2 rounded ${
                      n <= feedbackStars ? "text-amber-500" : "text-zinc-300"
                    }`}
                    title={`${n} star${n > 1 ? "s" : ""}`}
                  >
                    <StarIcon className="w-6 h-6" />
                  </button>
                ))}
              </div>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="What did you think? (mock)"
                className="w-full border rounded p-2 text-sm"
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowFeedbackFor(null)}
                className="px-4 py-2 rounded border hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert("⭐ Thanks for the feedback! (mock)");
                  setShowFeedbackFor(null);
                }}
                className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Submit
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

{/* Phase 2 “Coming Soon” modal (ADD) */}
<Dialog open={phase2Open} onClose={() => setPhase2Open(false)} className="relative z-50">
  <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
  <div className="fixed inset-0 flex items-center justify-center p-4">
    <Dialog.Panel className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 space-y-4 text-center">
      <div className="flex justify-between items-center">
        <Dialog.Title className="text-lg font-semibold">
          🚧 {phase2Feature || "Feature"} — Coming Soon
        </Dialog.Title>
        <button onClick={() => setPhase2Open(false)}>
          <XMarkIcon className="w-5 h-5 text-gray-500 hover:text-gray-700" />
        </button>
      </div>

      <p className="text-gray-600">
        Phase 2 custom development coming soon!
      </p>

      <div className="text-right">
        <button
          onClick={() => setPhase2Open(false)}
          className="px-4 py-2 rounded border hover:bg-gray-50"
        >
          Close
        </button>
      </div>
    </Dialog.Panel>
  </div>
</Dialog>




      {/* Sync instructions modal (new) */}
      <Dialog open={showSyncModal} onClose={() => setShowSyncModal(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center">
              <Dialog.Title className="text-lg font-semibold">Import your .ics</Dialog.Title>
              <button onClick={() => setShowSyncModal(false)}>
                <XMarkIcon className="w-5 h-5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            <ol className="list-decimal ml-5 space-y-2 text-sm text-zinc-700">
              <li>Open Google Calendar.</li>
              <li>Click the gear → <em>Settings</em> → <em>Import & export</em>.</li>
              <li>Select the downloaded <code>.ics</code> file and choose your calendar.</li>
              <li>Click <strong>Import</strong>.</li>
            </ol>
            <div className="text-right">
              <button
                onClick={() => setShowSyncModal(false)}
                className="px-4 py-2 rounded border hover:bg-gray-50"
              >
                Done
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </section>
  );
}
