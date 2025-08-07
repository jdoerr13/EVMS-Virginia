//This allows the entire app to recognize whether the user is an admin, eventManager, or public. 


// src/contexts/RoleContext.js
import React, { createContext, useContext, useState } from "react";

const RoleContext = createContext();

export function RoleProvider({ children }) {
  const [role, setRole] = useState(null); // e.g., "admin", "eventManager", "public"

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  return useContext(RoleContext);
}
