import React, { useState } from "react";

export default function SecuritySettings() {
  const [settings, setSettings] = useState({
    enforceStrongPasswords: true,
    requireMFA: false,
    sessionTimeout: 30,
    roleBasedAccess: true,
  });

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg space-y-6">
      {/* RFP Context */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-sm text-gray-700">
        <p className="font-semibold">This section will manage security and access control for EVMS, including:</p>
        <ul className="list-disc ml-5 mt-2 space-y-1">
          <li>Role-based access restrictions for all modules</li>
          <li>Multi-factor authentication (MFA) and strong password enforcement</li>
          <li>Automatic session timeout and audit logging</li>
          <li>Secure API access and encryption of sensitive data</li>
        </ul>
        <p className="mt-2 italic">
          * Per RFP requirements, future phases will integrate SSO (Single Sign-On) with VCCS systems, implement full encryption at rest, and meet FERPA & HIPAA compliance where applicable.
        </p>
      </div>

      {/* Demo Banner */}
      <div className="bg-gray-100 text-gray-700 p-3 rounded">
        <strong>Demo Mode:</strong> Security settings are read-only placeholders.
      </div>

      <h2 className="text-2xl font-bold">Security & Access Control</h2>

      {/* Settings Table */}
      <table className="w-full border-collapse mt-4">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Setting</th>
            <th className="p-2 border">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2 border">Enforce Strong Passwords</td>
            <td className="p-2 border">
              <input
                type="checkbox"
                checked={settings.enforceStrongPasswords}
                onChange={(e) => handleChange("enforceStrongPasswords", e.target.checked)}
                disabled
              />
            </td>
          </tr>
          <tr>
            <td className="p-2 border">Require Multi-Factor Authentication</td>
            <td className="p-2 border">
              <input
                type="checkbox"
                checked={settings.requireMFA}
                onChange={(e) => handleChange("requireMFA", e.target.checked)}
                disabled
              />
            </td>
          </tr>
          <tr>
            <td className="p-2 border">Session Timeout (minutes)</td>
            <td className="p-2 border">
              <input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => handleChange("sessionTimeout", e.target.value)}
                disabled
                className="w-20 border rounded p-1"
              />
            </td>
          </tr>
          <tr>
            <td className="p-2 border">Role-Based Access Control</td>
            <td className="p-2 border">
              <input
                type="checkbox"
                checked={settings.roleBasedAccess}
                onChange={(e) => handleChange("roleBasedAccess", e.target.checked)}
                disabled
              />
            </td>
          </tr>
        </tbody>
      </table>

      {/* Save Button (Disabled in Demo Mode) */}
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
        onClick={() => alert("Demo Mode: Saving security settings is disabled.")}
      >
        Save Settings
      </button>
    </div>
  );
}
