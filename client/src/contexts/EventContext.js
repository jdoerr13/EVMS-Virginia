import React, { createContext, useContext, useState, useEffect } from "react";
import { eventsAPI, registrationsAPI, documentsAPI } from '../utils/api';

const EventContext = createContext();

// Keep the seed events as fallback for development
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load events from API on component mount
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await eventsAPI.getAll();
      
      // Transform API data to match frontend format
      const transformedEvents = data.map(event => ({
        id: event.id,
        title: event.title,
        college: event.college || 'VCCS',
        venue: event.venue || 'TBD',
        date: event.date,
        startTime: event.start_time?.substring(0, 5) || 'TBD',
        endTime: event.end_time?.substring(0, 5) || 'TBD',
        description: event.description || '',
        status: event.status || 'Pending',
        requester: event.requester_name || 'vccs@vccs.edu',
        sessions: [],
        registrations: [],
        docs: []
      }));
      
      setEvents(transformedEvents);
    } catch (error) {
      console.error('Failed to load events:', error);
      setError('Failed to load events');
      // Fallback to seed data for development
      setEvents(seedEvents());
    } finally {
      setLoading(false);
    }
  };

  const addEvent = async (event) => {
    try {
      setError(null);
      const newEvent = await eventsAPI.create(event);
      setEvents((prev) => [...prev, newEvent]);
      return newEvent;
    } catch (error) {
      setError('Failed to create event');
      throw error;
    }
  };

  const addRegistration = async (eventId, registration) => {
    try {
      setError(null);
      const newRegistration = await registrationsAPI.create({
        event_id: eventId,
        ...registration
      });
      // Refresh events to get updated registration data
      await loadEvents();
      return newRegistration;
    } catch (error) {
      setError('Failed to add registration');
      throw error;
    }
  };

  const updateEventStatus = async (id, newStatus) => {
    try {
      setError(null);
      await eventsAPI.updateStatus(id, newStatus);
      setEvents((prev) =>
        prev.map((event) => (event.id === id ? { ...event, status: newStatus } : event))
      );
    } catch (error) {
      setError('Failed to update event status');
      throw error;
    }
  };

  const deleteEvent = async (id) => {
    try {
      setError(null);
      await eventsAPI.delete(id);
      setEvents((prev) => prev.filter((event) => event.id !== id));
    } catch (error) {
      setError('Failed to delete event');
      throw error;
    }
  };

  const addDoc = async (eventId, file) => {
    try {
      setError(null);
      const newDoc = await documentsAPI.upload(eventId, file);
      setEvents((prev) =>
        prev.map((e) => {
          if (e.id !== eventId) return e;
          return { ...e, docs: [...(e.docs || []), newDoc] };
        })
      );
      return newDoc;
    } catch (error) {
      setError('Failed to upload document');
      throw error;
    }
  };

  return (
    <EventContext.Provider
      value={{ 
        events, 
        loading, 
        error, 
        addEvent, 
        updateEventStatus, 
        deleteEvent,
        addRegistration, 
        addDoc,
        loadEvents,
        clearError: () => setError(null)
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  return useContext(EventContext);
}
