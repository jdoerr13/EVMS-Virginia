// src/pages/Compliance.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Compliance() {
  const navigate = useNavigate();

  // Mock compliance checklist
  const mockCompliance = [
    { id: 1, policy: "FERPA Data Protection", status: "Drafted", lastReview: "2025-07-15" },
    { id: 2, policy: "ADA/Section 508 Accessibility", status: "In Review", lastReview: "2025-07-20" },
    { id: 3, policy: "GDPR / CCPA Privacy", status: "Approved", lastReview: "2025-06-10" },
    { id: 4, policy: "PCI DSS Payment Security", status: "Not Started", lastReview: "-" },
    { id: 5, policy: "Data Retention & Erasure", status: "Drafted", lastReview: "2025-07-25" },
    { id: 6, policy: "Ethical AI & Bias Mitigation", status: "Not Started", lastReview: "-" }
  ];

  return (
    <div className="space-y-6">
      {/* Demo mode notice */}
      <div className="bg-gray-100 text-gray-700 p-3 rounded">
        <strong>Demo Mode:</strong> Compliance policy management is read-only. Placeholder per RFP.
      </div>

      {/* Header + back button */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Compliance & Policies</h2>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          ← Back
        </button>
      </div>

      {/* Short RFP description */}
      <div className="bg-white shadow rounded-lg p-4 space-y-2">
        <p>This module will store, manage, and track required compliance policies, ensuring the system meets:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Educational privacy laws (FERPA)</li>
          <li>Accessibility standards (ADA / Section 508)</li>
          <li>International and state privacy laws (GDPR, CCPA)</li>
          <li>Payment security requirements (PCI DSS)</li>
          <li>Data retention and deletion rules</li>
          <li>Ethical AI guidelines and bias mitigation</li>
        </ul>
        <p className="text-gray-500 text-sm">
          * Per RFP, these policies must be reviewed regularly, version-controlled, and exportable for audits.
        </p>
      </div>

      {/* Mock compliance table */}
      <table className="w-full border-collapse mt-4">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Policy</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Last Review</th>
          </tr>
        </thead>
        <tbody>
          {mockCompliance.map(c => (
            <tr key={c.id}>
              <td className="p-2 border">{c.policy}</td>
              <td className="p-2 border">{c.status}</td>
              <td className="p-2 border">{c.lastReview}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add new policy (demo only) */}
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
        onClick={() => alert("Demo Mode: Adding compliance policies is disabled in this demo.")}
      >
        Add Policy
      </button>
    </div>
  );
}
