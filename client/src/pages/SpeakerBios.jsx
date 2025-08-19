// src/pages/SpeakerBios.jsx
import React, { useState } from "react";
import { useRole } from "../contexts/RoleContext";

// Reusable modal
function Modal({ show, onClose, children }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}

// 🎤 Diverse seeded profiles
const initialProfiles = [
  {
    id: 1,
    name: "The Skyline Band",
    role: "Performer",
    affiliation: "Richmond, VA",
    topic: "Indie Rock",
    bio: "An indie band known for energetic live shows and soulful lyrics.",
    sessions: ["Evening Concert – Main Stage"],
    photo: "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?q=80&w=800",
  },
  {
    id: 2,
    name: "Dr. Alice Morgan",
    role: "Keynote Speaker",
    affiliation: "Tidewater Community College",
    topic: "AI in Education",
    bio: "Leading researcher in AI-driven learning solutions.",
    sessions: ["Opening Keynote: AI in the Classroom"],
    photo: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=800",
  },
  {
    id: 3,
    name: "Marcus Lee",
    role: "Comedian",
    affiliation: "Washington, D.C.",
    topic: "Stand-up Comedy",
    bio: "Stand-up comic featured on national tours and comedy festivals.",
    sessions: ["Comedy Night Showcase"],
    photo: "https://images.unsplash.com/photo-1525182008055-f88b95ff7980?q=80&w=800",
  },
  {
    id: 4,
    name: "Sophia Martinez",
    role: "Performer",
    affiliation: "Piedmont Virginia CC",
    topic: "Dance & Choreography",
    bio: "Award-winning choreographer and performing artist.",
    sessions: ["Dance & Movement Workshop"],
photo: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=800&auto=format&fit=crop",

  },
  {
    id: 5,
    name: "Emily Chen",
    role: "Violinist",
    affiliation: "Blue Ridge Community College",
    topic: "Classical Music",
    bio: "Classically trained violinist performing globally.",
    sessions: ["Evening Concert: Strings Across Cultures"],
    photo: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=800",
  },
  {
    id: 6,
    name: "Daniel White",
    role: "Jazz Saxophonist",
    affiliation: "John Tyler Community College",
    topic: "Jazz Performance",
    bio: "Renowned jazz saxophonist performing internationally.",
    sessions: ["Evening Jazz Gala"],
photo: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop",

  },
  {
    id: 7,
    name: "Laura Singh",
    role: "Healthcare Panelist",
    affiliation: "Patrick Henry Community College",
    topic: "Telemedicine",
    bio: "Pioneering nurse practitioner innovating rural telemedicine.",
    sessions: ["Panel: Innovation in Healthcare"],
    photo: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=800",
  },
  {
    id: 8,
    name: "Robert Evans",
    role: "Photography Workshop",
    affiliation: "Southside Virginia Community College",
    topic: "Wildlife Photography",
    bio: "National Geographic-featured photographer.",
    sessions: ["Photography for Beginners"],
    photo: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?q=80&w=800&auto=format&fit=crop",

  },
  {
    id: 9,
    name: "Isabella Rossi",
    role: "Tech Entrepreneur",
    affiliation: "Danville Community College",
    topic: "Women in Tech",
    bio: "Founder advocating for women in STEM fields.",
    sessions: ["Keynote: Breaking Barriers in Tech"],
    photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800",
  },
];

// Component
export default function SpeakerBios() {
  const { role } = useRole();
  const [profiles, setProfiles] = useState(initialProfiles);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [selectedProfile, setSelectedProfile] = useState(null);

  const filteredProfiles = profiles.filter((p) => {
    return (
      (p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.topic.toLowerCase().includes(search.toLowerCase()) ||
        p.affiliation.toLowerCase().includes(search.toLowerCase())) &&
      (filterRole ? p.role === filterRole : true)
    );
  });

  return (
    <section className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Speakers, Bands & Performers</h1>

      {/* Admin Tools */}
      {role === "admin" && (
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => alert("Add profile (demo)")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            ➕ Add Profile
          </button>
        </div>
      )}

      {/* Search / Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by name, topic, or affiliation..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full md:w-1/2"
        />
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="border p-2 rounded w-full md:w-1/4"
        >
          <option value="">All Roles</option>
          {[...new Set(profiles.map((p) => p.role))].map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {/* Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProfiles.map((p) => (
          <div
            key={p.id}
            className="bg-white shadow rounded-lg p-4 border hover:shadow-lg transition"
          >
            <img
              src={p.photo}
              alt={p.name}
              className="w-full h-48 object-cover rounded"
            />
            <h3 className="text-lg font-semibold mt-3">{p.name}</h3>
            <p className="text-sm text-gray-600">{p.role}</p>
            <p className="text-sm text-gray-500">{p.affiliation}</p>
            <button
              onClick={() => setSelectedProfile(p)}
              className="mt-3 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal show={!!selectedProfile} onClose={() => setSelectedProfile(null)}>
        {selectedProfile && (
          <div>
            <img
              src={selectedProfile.photo}
              alt={selectedProfile.name}
              className="w-full h-56 object-cover rounded mb-4"
            />
            <h2 className="text-2xl font-bold">{selectedProfile.name}</h2>
            <p className="text-gray-600">{selectedProfile.role}</p>
            <p className="text-gray-500">{selectedProfile.affiliation}</p>
            <p className="mt-4">{selectedProfile.bio}</p>
            <h4 className="mt-4 font-semibold">Sessions</h4>
            <ul className="list-disc pl-5">
              {selectedProfile.sessions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
            <div className="mt-4 text-sm text-blue-600">
              Email: contact@example.com | LinkedIn: linkedin.com/in/example
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
