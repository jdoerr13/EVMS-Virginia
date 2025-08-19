import React, { useState } from "react";

export default function AccessibilityDemo() {
  const [highContrast, setHighContrast] = useState(false);

  return (
    <div className={highContrast ? "bg-black text-yellow-300 p-4" : "p-4"}>
      <h1 className="text-2xl font-bold mb-4">Accessibility</h1>
      <p className="mb-4">
        This page demonstrates WCAG 2.1 AA compliance features like keyboard
        navigation, ARIA labels, and high contrast mode.
      </p>
      <button
        aria-label="Toggle High Contrast Mode"
        onClick={() => setHighContrast((prev) => !prev)}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Toggle High Contrast
      </button>
      <form className="mt-6 space-y-4" aria-label="Contact form">
        <div>
          <label htmlFor="name" className="block mb-1 font-medium">
            Name
          </label>
          <input
            id="name"
            type="text"
            className="border p-2 rounded w-full"
            placeholder="Enter your name"
          />
        </div>
        <div>
          <label htmlFor="message" className="block mb-1 font-medium">
            Message
          </label>
          <textarea
            id="message"
            className="border p-2 rounded w-full"
            placeholder="Type your message"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
