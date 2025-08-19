import React, { createContext, useContext, useEffect, useState } from "react";
import { getColleges, getVenues, getEvents, postEvent, setStatus } from "../utils/api";

const EventContext = createContext();

function seedEvents() {
  return [
    // --- Your existing events ---
    {
      id: 1,
      title: "Fall Open House",
      college: "Tidewater Community College",
      venue: "Main Auditorium",
      date: "2025-09-15",
      startTime: "10:00",
      endTime: "14:00",
      description: "Tour campus facilities, meet faculty, and learn about programs.",
      status: "Pending",
      requester: "manager@tcc.edu",
      sessions: [
        { id: "s1", title: "Campus Tour", capacity: 40 },
        { id: "s2", title: "Financial Aid Q&A", capacity: 60 },
      ],
      registrations: [
        { name: "Alex Johnson", email: "alex.johnson@example.com" },
        { name: "Maria Garcia", email: "maria.garcia@example.com" },
        { name: "Liam Brown", email: "liam.brown@example.com" },
      ],
      docs: [],
    },
    {
      id: 2,
      title: "Regional Job & Internship Fair",
      college: "Northern Virginia Community College",
      venue: "Exhibit Hall",
      date: "2025-10-05",
      startTime: "09:00",
      endTime: "16:00",
      description: "Meet employers and explore internship opportunities.",
      status: "Approved",
      requester: "jobs@nvc.edu",
      sessions: [],
      registrations: [
        { name: "Sarah Lee", email: "sarah.lee@example.com" },
        { name: "David Kim", email: "david.kim@example.com" },
      ],
      docs: [],
    },
    {
      id: 3,
      title: "Winter Graduation Ceremony",
      college: "Piedmont Virginia Community College",
      venue: "Auditorium Hall",
      date: "2025-12-12",
      startTime: "13:00",
      endTime: "16:00",
      description: "Celebrate the achievements of our graduating students.",
      status: "Approved",
      requester: "events@pvcc.edu",
      sessions: [],
      registrations: [
        { name: "Emily Davis", email: "emily.davis@example.com" },
        { name: "Michael Thompson", email: "michael.thompson@example.com" },
        { name: "Olivia Martinez", email: "olivia.martinez@example.com" },
      ],
      docs: [],
    },
    {
      id: 4,
      title: "Arts & Culture Festival",
      college: "Virginia Western Community College",
      venue: "Student Commons",
      date: "2025-11-12",
      startTime: "12:00",
      endTime: "18:00",
      description: "Live performances, art exhibits, and cultural food stalls.",
      status: "Pending",
      requester: "arts@vwcc.edu",
      sessions: [
        { id: "s1", title: "Photography Workshop", capacity: 30 },
        { id: "s2", title: "Dance Performance", capacity: 100 },
      ],
      registrations: [
        { name: "Sophie Walker", email: "sophie.walker@example.com" },
      ],
      docs: [],
    },
    {
      id: 5,
      title: "Healthcare Career Expo",
      college: "Piedmont Virginia Community College",
      venue: "Nursing Building Auditorium",
      date: "2025-09-28",
      startTime: "08:30",
      endTime: "15:00",
      description: "Meet healthcare recruiters and learn about nursing programs.",
      status: "Approved",
      requester: "health@pvcc.edu",
      sessions: [
        { id: "s1", title: "CPR Training Demo", capacity: 40 },
        { id: "s2", title: "Meet the Nurses Panel", capacity: 80 },
      ],
      registrations: [
        { name: "Chris Allen", email: "chris.allen@example.com" },
      ],
      docs: [],
    },

    // --- New mock events ---
    {
      id: 6,
      title: "Technology Innovation Summit",
      college: "Northern Virginia Community College",
      venue: "Tech Hall A",
      date: "2025-10-22",
      startTime: "09:00",
      endTime: "17:00",
      description: "Showcasing the latest in AI, robotics, and software development.",
      status: "Approved",
      requester: "techsummit@nvc.edu",
      sessions: [
        { id: "s1", title: "AI in Education", capacity: 50 },
        { id: "s2", title: "Robotics Live Demo", capacity: 40 },
      ],
      registrations: [
        { name: "Jordan White", email: "jordan.white@example.com" },
        { name: "Priya Singh", email: "priya.singh@example.com" },
      ],
      docs: [],
    },
    {
      id: 7,
      title: "Leadership Development Workshop",
      college: "Tidewater Community College",
      venue: "Leadership Center Room 101",
      date: "2025-11-05",
      startTime: "13:00",
      endTime: "17:00",
      description: "Interactive workshop to build leadership and team skills.",
      status: "Pending",
      requester: "leadership@tcc.edu",
      sessions: [
        { id: "s1", title: "Team Building Exercises", capacity: 25 },
        { id: "s2", title: "Conflict Resolution", capacity: 30 },
      ],
      registrations: [],
      docs: [],
    },
    {
      id: 8,
      title: "Community Volunteer Fair",
      college: "Virginia Western Community College",
      venue: "Outdoor Quad",
      date: "2025-09-20",
      startTime: "10:00",
      endTime: "14:00",
      description: "Connect with local non-profits and find volunteer opportunities.",
      status: "Approved",
      requester: "volunteer@vwcc.edu",
      sessions: [],
      registrations: [
        { name: "Anna Scott", email: "anna.scott@example.com" },
      ],
      docs: [],
    },
    {
  id: 99,
  title: "AI & Future Tech Expo",
  college: "Virtual Community College",
  venue: "Innovation Hall",
  date: "2025-10-20",
  startTime: "09:00",
  endTime: "17:00",
  description: "Explore the latest in AI, robotics, and future technologies.",
  status: "Approved",
  requester: "ai-tech@vccs.edu"
}
  ];
}
export function EventProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [lookups, setLookups] = useState({ collegesById: {}, venuesById: {} });

  useEffect(() => {
    (async () => {
      try {
        // load lookups (optional for future use)
        const [cRes, vRes] = await Promise.all([getColleges(), getVenues()]);
        const collegesById = Object.fromEntries((cRes.data || []).map(c => [c.id, c.name]));
        const venuesById   = Object.fromEntries((vRes.data || []).map(v => [v.id, v.name]));
        setLookups({ collegesById, venuesById });

        // load events
        const eRes = await getEvents();
        const fromDB = (eRes.data || []).map(row => ({
          id: row.id,
          title: row.title,
          college: row.college || collegesById[row.college_id] || "",
          venue: row.venue || venuesById[row.venue_id] || "",
          date: row.date,
          startTime: row.start_time?.slice(0, 5) || "",
          endTime: row.end_time?.slice(0, 5) || "",
          description: row.description || "",
          status: row.status || "Pending",
          requester: row.requester_name || ""
        }));

                    const unique = [];
            const seen = new Set();
            for (const e of fromDB) {
              if (!seen.has(e.id)) {
                unique.push(e);
                seen.add(e.id);
              }
            }
setEvents(unique);
      } catch (err) {
        console.error("EventContext error:", err);
        setEvents([]); 
      }
    })();
  }, []);

  const addEvent = async (uiEvent) => {
    try {
      const payload = {
        title: uiEvent.title,
        description: uiEvent.description || "",
        college_id: findId(lookups.collegesById, uiEvent.college),
        venue_id: findId(lookups.venuesById, uiEvent.venue),
        date: uiEvent.date,
        start_time: uiEvent.startTime || null,
        end_time: uiEvent.endTime || null,
        max_capacity: uiEvent.max_capacity || null,
        status: uiEvent.status || "Pending",
        requester_id: 1, // demo
      };
      const { data } = await postEvent(payload);
      setEvents(prev => [...prev, { ...uiEvent, id: data.id }]);
    } catch {
      // demo fallback
      setEvents(prev => [...prev, { ...uiEvent, id: Date.now() }]);
    }
  };

  const updateEventStatus = async (id, newStatus) => {
    try {
      await setStatus(id, newStatus);
    } catch (err) {
      console.error("updateEventStatus error:", err);
    }
    setEvents(prev =>
      prev.map(e => (e.id === id ? { ...e, status: newStatus } : e))
    );
  };

  return (
    <EventContext.Provider value={{ events, addEvent, updateEventStatus }}>
      {children}
    </EventContext.Provider>
  );
}

function findId(map, name) {
  const hit = Object.entries(map).find(([, v]) => v === name);
  return hit ? Number(hit[0]) : null;
}

export function useEvents() {
  return useContext(EventContext);
}
