import React from "react";

const speakers = [
  {
    name: "Dr. Jane Smith",
    title: "Keynote Speaker",
    bio: "Expert in higher education strategy with 20+ years of experience.",
    topic: "Future of Educational Events",
    photo: "https://via.placeholder.com/150"
  },
  {
    name: "John Doe",
    title: "Workshop Leader",
    bio: "Specialist in venue technology and resource optimization.",
    topic: "Smart Venue Management",
    photo: "https://via.placeholder.com/150"
  }
];

export default function SpeakerBios() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Featured Speakers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {speakers.map((s, idx) => (
          <div key={idx} className="bg-white p-4 rounded-lg shadow">
            <img src={s.photo} alt={s.name} className="w-32 h-32 rounded-full mx-auto" />
            <h3 className="text-xl font-semibold mt-4">{s.name}</h3>
            <p className="text-gray-600">{s.title}</p>
            <p className="mt-2 text-gray-700 text-sm">{s.bio}</p>
            <p className="mt-2 font-semibold">Topic: {s.topic}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
