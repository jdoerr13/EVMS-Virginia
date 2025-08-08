import React, { useState } from "react";

export default function ContractGenerator() {
  const [template, setTemplate] = useState("Standard Event Contract");
  const [eventName, setEventName] = useState("");
  const [preview, setPreview] = useState("");

  const generatePreview = () => {
    setPreview(
      `Contract for ${eventName || "Untitled Event"}\n\nTemplate: ${template}\n\nTerms & Conditions:\n[Insert terms here...]`
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Contract Generator</h1>

      <div className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Event Name</label>
          <input
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter event name"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Select Template</label>
          <select
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option>Standard Event Contract</option>
            <option>Venue Rental Agreement</option>
            <option>Speaker Engagement Letter</option>
          </select>
        </div>

        <button
          onClick={generatePreview}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Generate Preview
        </button>
      </div>

      {preview && (
        <div className="mt-6 border rounded p-4 bg-gray-50 whitespace-pre-line">
          {preview}
        </div>
      )}
    </div>
  );
}
