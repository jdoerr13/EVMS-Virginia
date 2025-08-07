// EventForm submissions so that:

// Event Managers create events (with status = "Pending")

// Admins see those submissions on the Review Requests page

// For demo purposes, we’ll share this data using temporary global state (context) so both pages access the same event list — no backend needed yet.

import React, { createContext, useContext, useState } from "react";

const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);

  const addEvent = (newEvent) => {
    setEvents((prev) => [...prev, { ...newEvent, status: "Pending" }]);
  };

  const updateEventStatus = (id, status) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status } : e))
    );
  };

  return (
    <EventContext.Provider value={{ events, addEvent, updateEventStatus }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => useContext(EventContext);
