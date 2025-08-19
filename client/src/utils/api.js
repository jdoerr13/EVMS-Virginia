// import axios from "axios";

// const baseURL =
//   process.env.REACT_APP_API_URL ||
//   import.meta?.env?.VITE_API_URL ||
//   "http://localhost:4000";

// const api = axios.create({
//   baseURL,
//   headers: { "Content-Type": "application/json" },
// });

// // ---- COLLEGES & VENUES ----
// export const getColleges   = () => api.get("/colleges");
// export const getVenues     = () => api.get("/venues");

// // ---- EVENTS ----
// export const getEvents     = () => api.get("/events");
// export const getEventById  = (id) => api.get(`/events/${id}`);
// export const postEvent     = (payload) => api.post("/events", payload);
// export const setStatus     = (id, status) =>
//   api.patch(`/events/${id}/status`, { status });

// // ---- REGISTRATIONS ----
// export const registerFor             = (payload) => api.post("/registrations", payload);
// export const getRegistrations        = (userId = 3) => api.get(`/registrations/student/${userId}`);
// export const getRegistrationsByEvent = (eventId) => api.get(`/registrations/event/${eventId}`);


// // ---- AUTH ----
// export const loginAPI = (email, password) =>
//   api.post("/auth/login", { email, password });

// export default api;
import axios from "axios";

const baseURL =
  process.env.REACT_APP_API_URL ||
  import.meta?.env?.VITE_API_URL ||
  "http://localhost:4000";

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// ---- COLLEGES & VENUES ----
export const getColleges = () => api.get("/colleges");
export const getVenues   = () => api.get("/venues");

// ---- EVENTS ----
export const getEvents    = () => api.get("/events");
export const getEventById = (id) => api.get(`/events/${id}`);
export const postEvent    = (payload) => api.post("/events", payload);
export const requestEvent = (payload) => api.post("/events/request", payload);
export const setStatus    = (id, status) =>
  api.patch(`/events/${id}/status`, { status });

// ---- REGISTRATIONS ----
export const registerFor             = (payload) => api.post("/registrations", payload);
export const getRegistrations        = (userId = 3) => api.get(`/registrations/student/${userId}`);
export const getRegistrationsByEvent = (eventId) => api.get(`/registrations/event/${eventId}`);

// ---- AUTH ----
export const loginAPI = (email, password) =>
  api.post("/auth/login", { email, password });
export const registerUser = (payload) =>
  api.post("/auth/register", payload);

export default api;
