import React from "react";
import { useNavigate } from "react-router-dom";

export default function Compliance() {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-white shadow rounded-lg space-y-6">
      {/* RFP Context */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-sm text-gray-700">
        <p className="font-semibold">This section will manage compliance and policy documentation for all events, including:</p>
        <ul className="list-disc ml-5 mt-2 space-y-1">
          <li>Storage and tracking of safety, security, and accessibility policies</li>
          <li>Automatic expiration alerts for required certifications</li>
          <li>FERPA, ADA, OSHA, and local ordinance compliance checks</li>
          <li>Role-based access to sensitive compliance documents</li>
        </ul>
        <p className="mt-2 italic">
          * Per RFP requirements, future phases will include automated policy updates, e-signatures for acknowledgments, and integration with audit logs.
        </p>
      </div>

      {/* Demo Banner */}
      <div className="bg-gray-100 text-gray-700 p-3 rounded">
        <strong>Demo Mode:</strong> Compliance module is in placeholder mode. No live document storage is connected.
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Compliance & Policies</h2>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          ← Back
        </button>
      </div>

      {/* Mock Feature Cards */}
      <div className="space-y-4">
        <div className="border rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold">📄 Policy Library</h3>
          <p className="text-sm text-gray-600">
            Centralized repository for safety, accessibility, and operational policies with search and version control.
          </p>
        </div>

        <div className="border rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold">⏰ Expiration Tracking</h3>
          <p className="text-sm text-gray-600">
            Automated reminders for upcoming policy expirations and required updates.
          </p>
        </div>

        <div className="border rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold">🔐 Restricted Access</h3>
          <p className="text-sm text-gray-600">
            Role-based controls for sensitive documents such as security protocols or vendor NDAs.
          </p>
        </div>

        <div className="border rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold">✅ Compliance Checks</h3>
          <p className="text-sm text-gray-600">
            Built-in validation tools for FERPA, ADA, OSHA, and other regulatory requirements.
          </p>
        </div>
      </div>

      {/* Demo Action */}
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
        onClick={() => alert("Demo Mode: Compliance document upload not enabled in this demo.")}
      >
        Upload Compliance Document
      </button>
    </div>
  );
}
