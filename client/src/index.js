import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { RoleProvider } from "./contexts/RoleContext";
import { EventProvider } from "./contexts/EventContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <RoleProvider>
        <EventProvider> 
          <App />
        </EventProvider>
      </RoleProvider>
    </BrowserRouter>
  </React.StrictMode>
);
