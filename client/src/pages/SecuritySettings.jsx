import React from "react";
import { useNavigate } from "react-router-dom";

export default function SecuritySettings() {
  const navigate = useNavigate();

  // Mock security settings data
  const mockSettings = [
    { id: 1, setting: "SSO/SAML Integration", status: "Not Configured" },
    { id: 2, setting: "OIDC with JIT Provisioning", status: "Not Configured" },
    { id: 3, setting: "Role-Based Access Control", status: "Enabled" },
    { id: 4, setting: "Multi-Factor Authentication", status: "Coming in Phase 2" },
    { id: 5, setting: "Audit Logging", status: "Coming in Phase 3" }
  ];

  return (
    <div className="p-6 bg-white shadow rounded-lg space-y-6">
      {/* RFP Context */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-sm text-gray-700">
        <p className="font-semibold">This section will provide configuration and monitoring for security features including:</p>
        <ul className="list-disc ml-5 mt-2 space-y-1">
          <li>SSO/SAML 2.x or OIDC integration with Just-In-Time (JIT) provisioning</li>
          <li>Role-based access with segregation by college and tenant</li>
          <li>Multi-factor authentication for all privileged accounts</li>
          <li>Audit logging for all login and configuration changes</li>
        </ul>
        <p className="mt-2 italic">
          * Per RFP requirements, these features will meet FERPA, GDPR/CCPA, and SOC 2 Type II compliance.
        </p>
      </div>

      {/* Demo Mode Banner */}
      <div className="bg-gray-100 text-gray-700 p-3 rounded">
        <strong>Demo Mode:</strong> Security settings are read-only. Placeholder per RFP.
      </div>

      {/* Header + Back Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Security & Authentication Settings</h2>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          ← Back
        </button>
      </div>

      {/* Feature Cards */}
      <div className="space-y-4">
        <div className="border rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold">🔑 SSO & SAML Integration</h3>
          <p className="text-sm text-gray-600">
            Enable secure single sign-on for staff and attendees using institution identity providers.
          </p>
        </div>
        <div className="border rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold">🛡 Role-Based Access Control</h3>
          <p className="text-sm text-gray-600">
            Assign roles with specific permissions to protect sensitive event data.
          </p>
        </div>
        <div className="border rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold">📲 Multi-Factor Authentication</h3>
          <p className="text-sm text-gray-600">
            Add a second layer of security for high-privilege accounts.
          </p>
        </div>
        <div className="border rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold">📜 Audit Logging</h3>
          <p className="text-sm text-gray-600">
            Track all login attempts and configuration changes for compliance and investigations.
          </p>
        </div>
      </div>

      {/* Mock Settings Table */}
      <table className="w-full border-collapse mt-6">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Setting</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {mockSettings.map(s => (
            <tr key={s.id}>
              <td className="p-2 border">{s.setting}</td>
              <td className="p-2 border">{s.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Demo Action */}
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
        onClick={() => alert("Demo Mode: Updating settings is disabled in this demo.")}
      >
        Update Settings
      </button>
    </div>
  );
}
