import React from "react";

const contacts = [
  { name: "Acme Corp", contact: "Alice Johnson", stage: "Lead", email: "alice@example.com" },
  { name: "Beta University", contact: "Bob Smith", stage: "Proposal Sent", email: "bob@example.com" },
  { name: "City Events", contact: "Carol Davis", stage: "Contract Signed", email: "carol@example.com" }
];

export default function CRM() {
  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">CRM Overview</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Organization</th>
            <th className="p-2 border">Contact</th>
            <th className="p-2 border">Stage</th>
            <th className="p-2 border">Email</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((c, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="p-2 border">{c.name}</td>
              <td className="p-2 border">{c.contact}</td>
              <td className="p-2 border">{c.stage}</td>
              <td className="p-2 border text-blue-600 underline">{c.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
