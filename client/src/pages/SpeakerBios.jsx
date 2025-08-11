// src/pages/SpeakerBios.jsx
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

// Reusable modal component
function Modal({ show, onClose, children }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full transform transition-all scale-100 p-6 relative animate-fadeIn">
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

// Seeded mock profiles
const initialProfiles = [
  {
    id: 1,
    name: "Dr. Alice Morgan",
    role: "Keynote Speaker",
    affiliation: "Tidewater Community College",
    topic: "AI in Education",
    bio: "Dr. Morgan is a leading researcher in AI-driven learning solutions.",
    sessions: ["Opening Keynote: AI in the Classroom"],
    photo: "https://randomuser.me/api/portraits/women/11.jpg",
  },
  {
    id: 2,
    name: "James Carter",
    role: "Panelist",
    affiliation: "Northern Virginia Community College",
    topic: "Renewable Energy",
    bio: "James has 15 years of experience in sustainable energy projects.",
    sessions: ["Panel: Future of Renewable Energy"],
    photo: "https://randomuser.me/api/portraits/men/12.jpg",
  },
  {
    id: 3,
    name: "Sophia Martinez",
    role: "Workshop Leader",
    affiliation: "Piedmont Virginia CC",
    topic: "Performing Arts",
    bio: "Sophia is an award-winning choreographer and director.",
    sessions: ["Dance & Movement Workshop"],
    photo: "https://randomuser.me/api/portraits/women/13.jpg",
  },
  {
    id: 4,
    name: "David Kim",
    role: "Moderator",
    affiliation: "Virginia Western CC",
    topic: "Cybersecurity",
    bio: "David is a certified security analyst with expertise in cloud systems.",
    sessions: ["Cybersecurity in Higher Education"],
    photo: "https://randomuser.me/api/portraits/men/14.jpg",
  },
  {
    id: 5,
    name: "Emily Chen",
    role: "Performer",
    affiliation: "Blue Ridge Community College",
    topic: "Classical Music",
    bio: "Emily is a classically trained violinist performing worldwide.",
    sessions: ["Evening Concert: Strings Across Cultures"],
    photo: "https://randomuser.me/api/portraits/women/15.jpg",
  },
  {
    id: 6,
    name: "Michael Brown",
    role: "Guest Lecturer",
    affiliation: "Mountain Empire Community College",
    topic: "Business Leadership",
    bio: "Michael has authored 3 books on strategic leadership.",
    sessions: ["Leadership in the 21st Century"],
    photo: "https://randomuser.me/api/portraits/men/16.jpg",
  },
  {
    id: 7,
    name: "Laura Singh",
    role: "Panelist",
    affiliation: "Patrick Henry Community College",
    topic: "Healthcare Innovation",
    bio: "Laura is a nurse practitioner pioneering telemedicine in rural areas.",
    sessions: ["Panel: Innovation in Healthcare Delivery"],
    photo: "https://randomuser.me/api/portraits/women/17.jpg",
  },
  {
    id: 8,
    name: "Robert Evans",
    role: "Workshop Leader",
    affiliation: "Southside Virginia Community College",
    topic: "Photography",
    bio: "Robert has been featured in National Geographic for his wildlife photography.",
    sessions: ["Photography for Beginners"],
    photo: "https://randomuser.me/api/portraits/men/18.jpg",
  },
  {
    id: 9,
    name: "Isabella Rossi",
    role: "Keynote Speaker",
    affiliation: "Danville Community College",
    topic: "Women in Tech",
    bio: "Isabella is a startup founder advocating for women in STEM.",
    sessions: ["Keynote: Breaking Barriers in Tech"],
    photo: "https://randomuser.me/api/portraits/women/19.jpg",
  },
  {
    id: 10,
    name: "Daniel White",
    role: "Performer",
    affiliation: "John Tyler Community College",
    topic: "Jazz Performance",
    bio: "Daniel is a renowned jazz saxophonist performing internationally.",
    sessions: ["Evening Jazz Gala"],
    photo: "https://randomuser.me/api/portraits/men/20.jpg",
  },
];

// Random mock generator
function generateMockProfile() {
  const names = ["Alex Turner", "Rachel Lee", "Hassan Ali", "Maria Gomez", "Ethan Clarke"];
  const roles = ["Keynote Speaker", "Panelist", "Workshop Leader", "Performer", "Moderator"];
  const topics = ["AI in Education", "Renewable Energy", "Performing Arts", "Cybersecurity", "Healthcare Innovation"];
  const affiliations = [
    "Tidewater Community College",
    "Northern Virginia Community College",
    "Piedmont Virginia CC",
    "Virginia Western CC",
  ];
  const randomGender = Math.random() > 0.5 ? "men" : "women";
  const randomId = Math.floor(Math.random() * 99);
  return {
    id: Date.now(),
    name: names[Math.floor(Math.random() * names.length)],
    role: roles[Math.floor(Math.random() * roles.length)],
    affiliation: affiliations[Math.floor(Math.random() * affiliations.length)],
    topic: topics[Math.floor(Math.random() * topics.length)],
    bio: "This is a generated mock profile for demonstration purposes.",
    sessions: ["Session TBD"],
    photo: `https://randomuser.me/api/portraits/${randomGender}/${randomId}.jpg`,
  };
}

export default function SpeakerBios() {
  const { user } = useAuth();
  const role = user?.role;
  const [profiles, setProfiles] = useState(initialProfiles);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [selectedProfile, setSelectedProfile] = useState(null);

  const filteredProfiles = profiles.filter((p) => {
    return (
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.topic.toLowerCase().includes(search.toLowerCase()) ||
      p.affiliation.toLowerCase().includes(search.toLowerCase())
    ) && (filterRole ? p.role === filterRole : true);
  });

  return (
    <section className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Speakers & Performers</h1>

      {/* Admin Tools */}
      {role === "admin" && (
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setProfiles((prev) => [...prev, generateMockProfile()])}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            ➕ Add Mock Profile
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
            {role === "admin" && (
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => alert("Edit profile (demo)")}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() =>
                    setProfiles((prev) =>
                      prev.filter((prof) => prof.id !== selectedProfile.id)
                    )
                  }
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </section>
  );
}
