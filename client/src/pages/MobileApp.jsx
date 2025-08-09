import React from "react";

export default function MobileApp() {
  return (
    <div className="p-6 bg-white shadow rounded-lg space-y-6">
      {/* RFP Context */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-sm text-gray-700">
        <p className="font-semibold">This section will provide mobile and PWA access for event management, including:</p>
        <ul className="list-disc ml-5 mt-2 space-y-1">
          <li>Responsive mobile web interface and installable PWA</li>
          <li>Offline access for on-site event check-in</li>
          <li>Push notifications for schedule changes and alerts</li>
          <li>Mobile-friendly session registration and capacity updates</li>
        </ul>
        <p className="mt-2 italic">
          * Per RFP requirements, future phases will include integration with native iOS and Android apps, QR-based check-ins, and secure offline caching.
        </p>
      </div>

      {/* Demo Banner */}
      <div className="bg-gray-100 text-gray-700 p-3 rounded">
        <strong>Demo Mode:</strong> Mobile App/PWA features are in placeholder mode. No live app build is connected.
      </div>

      <h2 className="text-2xl font-bold">Mobile App / PWA Access</h2>

      {/* Mock Feature List */}
      <div className="space-y-4">
        <div className="border rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold">📱 Responsive Dashboard</h3>
          <p className="text-sm text-gray-600">
            The EVMS interface is optimized for mobile screens, ensuring all event tools are accessible from a smartphone or tablet.
          </p>
        </div>

        <div className="border rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold">🔔 Push Notifications</h3>
          <p className="text-sm text-gray-600">
            Alerts for schedule changes, room updates, and urgent messages will be sent to registered attendees via push notifications.
          </p>
        </div>

        <div className="border rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold">📶 Offline Access</h3>
          <p className="text-sm text-gray-600">
            Offline mode will allow event staff to check in attendees and manage registrations without an internet connection.
          </p>
        </div>

        <div className="border rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold">🎫 QR Code Check-In</h3>
          <p className="text-sm text-gray-600">
            Attendees will be able to scan a QR code to check in for sessions, improving flow and reducing wait times.
          </p>
        </div>
      </div>

      {/* Install PWA Button (Demo) */}
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
        onClick={() => alert("Demo Mode: PWA installation not enabled in this demo.")}
      >
        Install EVMS as a PWA
      </button>
    </div>
  );
}
