// src/context/EventContext.jsx
import React, { createContext, useContext, useState } from "react";

const EventContext = createContext();

export function EventProvider({ children }) {
  const [events, setEvents] = useState([
    // ✅ RFP-style seeded events
    {
      id: 1,
      title: "Fall Open House",
      college: "Tidewater Community College",
      venue: "Main Auditorium",
      date: "2025-09-15",
      description: "Tour campus facilities, meet faculty, and learn about programs.",
      status: "Pending",
      requester: "manager@tcc.edu"
    },
    {
      id: 2,
      title: "Regional Job & Internship Fair",
      college: "Northern Virginia Community College",
      venue: "Exhibit Hall",
      date: "2025-10-05",
      description: "Over 50 employers from the region recruiting students.",
      status: "Approved",
      requester: "career@nvcc.edu"
    },
    {
      id: 3,
      title: "STEM Innovation Conference",
      college: "Blue Ridge Community College",
      venue: "Science Building Room 101",
      date: "2025-08-15",
      description: "Workshops and talks on cutting-edge STEM research.",
      status: "Approved",
      requester: "stem@brcc.edu"
    },
    {
      id: 4,
      title: "Faculty Professional Development Workshop",
      college: "Virginia Western Community College",
      venue: "Conference Room B",
      date: "2025-08-20",
      description: "Enhance teaching methods and student engagement strategies.",
      status: "Pending",
      requester: "facultydev@vwcc.edu"
    },
    {
      id: 5,
      title: "Cultural Heritage Festival",
      college: "Piedmont Virginia Community College",
      venue: "Outdoor Quad",
      date: "2025-09-28",
      description: "Celebrate cultures through food, music, and dance.",
      status: "Approved",
      requester: "events@pvcc.edu"
    },
    {
      id: 6,
      title: "Women's Leadership Panel",
      college: "Tidewater Community College",
      venue: "Library Conference Center",
      date: "2025-10-12",
      description: "Hear from women leaders in business, politics, and STEM.",
      status: "Pending",
      requester: "leadership@tcc.edu"
    },
    {
      id: 7,
      title: "Basketball Season Opener",
      college: "Northern Virginia Community College",
      venue: "Sports Arena",
      date: "2025-11-02",
      description: "Kick-off game for the fall basketball season.",
      status: "Approved",
      requester: "athletics@nvcc.edu"
    },
    {
      id: 8,
      title: "Annual Scholarship Banquet",
      college: "Blue Ridge Community College",
      venue: "Dining Hall",
      date: "2025-09-18",
      description: "Recognizing student achievements and donors.",
      status: "Approved",
      requester: "foundation@brcc.edu"
    },
    {
      id: 9,
      title: "IT Career Bootcamp",
      college: "Virginia Western Community College",
      venue: "Computer Lab 3",
      date: "2025-09-25",
      description: "Intensive training for careers in IT and cybersecurity.",
      status: "Pending",
      requester: "itdept@vwcc.edu"
    },
    {
      id: 10,
      title: "Music Faculty Recital",
      college: "Piedmont Virginia Community College",
      venue: "Music Hall",
      date: "2025-08-30",
      description: "An evening performance by music faculty members.",
      status: "Approved",
      requester: "music@pvcc.edu"
    }
  ]);

  const addEvent = (event) => {
    setEvents((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...event,
        status: event.status || "Pending",
        requester: event.requester || "manager@vccs.edu"
      }
    ]);
  };

  const updateEventStatus = (id, newStatus) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === id ? { ...event, status: newStatus } : event
      )
    );
  };

  return (
    <EventContext.Provider value={{ events, addEvent, updateEventStatus }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  return useContext(EventContext);
}
