import React, { useEffect, useMemo, useRef, useState } from "react";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function ToggleButton({ label, on, onChange, shortcut }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => onChange(!on)}
      className={cx(
        "group relative inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition",
        on ? "bg-indigo-600 text-white border-indigo-600 shadow"
           : "bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
      )}
      title={shortcut ? `${label} • Shortcut: ${shortcut}` : label}
    >
      <span
        className={cx(
          "h-4 w-7 rounded-full transition-all",
          on ? "bg-white/25 ring-1 ring-white/40" : "bg-gray-200"
        )}
        aria-hidden="true"
      />
      <span className="font-medium">{label}</span>
      {shortcut && (
        <kbd className="ml-1 rounded border border-current/30 px-1 text-[10px] leading-none opacity-80">
          {shortcut}
        </kbd>
      )}
      <span
        className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-indigo-400/0 transition group-hover:ring-indigo-400/25"
        aria-hidden="true"
      />
    </button>
  );
}

export default function AccessibilityDemo() {
  const [highContrast, setHighContrast] = useState(false);
  const [dyslexic, setDyslexic] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false); // visually minimal on this page
  const [thickFocus, setThickFocus] = useState(false);
  const [cbSim, setCbSim] = useState(false); // subtle filter
  const [textScale, setTextScale] = useState(100); // % — scoped to sample text only
  const liveRef = useRef(null);

  const announce = (msg) => {
    if (!liveRef.current) return;
    liveRef.current.textContent = msg;
    setTimeout(() => (liveRef.current.textContent = ""), 350);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      const tag = (e.target?.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea") return;
      const k = e.key.toLowerCase();
      if (k === "h") setHighContrast((v) => (announce(`High contrast ${!v ? "on" : "off"}`), !v));
      if (k === "d") setDyslexic((v) => (announce(`Dyslexic font ${!v ? "on" : "off"}`), !v));
      if (k === "f") setThickFocus((v) => (announce(`Thick focus ${!v ? "on" : "off"}`), !v));
      if (k === "c") setCbSim((v) => (announce(`Color filter ${!v ? "on" : "off"}`), !v));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Thick Focus CSS (injected only when enabled)
  const thickFocusCSS = `
    :where(a,button,input,textarea,select,[role="button"]):focus-visible{
      outline:3px solid #6366f1 !important;
      outline-offset:2px !important;
      box-shadow:0 0 0 4px rgba(99,102,241,.35) !important;
      border-radius:.5rem !important;
    }
  `;

  // Wrapper theme
  const wrapperClass = useMemo(
    () =>
      cx(
        "p-6 rounded-2xl border",
        highContrast ? "bg-black text-yellow-300 border-yellow-400"
                     : "bg-white text-gray-900 border-gray-200",
        cbSim ? "filter contrast-125 saturate-75" : ""
      ),
    [highContrast, cbSim]
  );

  // Scoped sample text container gets inline var for scaling
  const sampleStyle = { "--scale": String(textScale / 100) };
  const sampleTextClass = cx(
    "[&_p]:m-0 space-y-3",
    "text-[calc(1rem*var(--scale))]",
    "leading-[calc(1.6*var(--scale))]",
    dyslexic ? "tracking-wide not-italic" : ""
  );

  const fieldClass = cx(
    "border rounded-md w-full px-3 py-2",
    highContrast
      ? "bg-black text-yellow-300 border-yellow-500 placeholder-yellow-500/70"
      : "bg-white text-gray-900 border-gray-300 placeholder-gray-400",
    "focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
  );

  return (
    <>
      {/* Inject thick focus CSS only when toggled */}
      {thickFocus && <style>{thickFocusCSS}</style>}

      <div className={wrapperClass}>
        {/* Header */}
        <header className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Accessibility Demo</h1>
            <p className={cx("text-sm", highContrast ? "text-yellow-300/80" : "text-gray-600")}>
              Toggle features below. Text size scaler is scoped to the sample text only.
            </p>
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap gap-2">
            <ToggleButton label="High Contrast" on={highContrast} onChange={setHighContrast} shortcut="H" />
            <ToggleButton label="Dyslexic Font" on={dyslexic} onChange={setDyslexic} shortcut="D" />
            <ToggleButton label="Thick Focus" on={thickFocus} onChange={setThickFocus} shortcut="F" />
            <ToggleButton label="Color Filter" on={cbSim} onChange={setCbSim} shortcut="C" />
          </div>
        </header>

        {/* Row: Sample text scaler + Contact form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sample Text Card */}
          <section className="rounded-xl border bg-white/60 dark:bg-black/20 p-4">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h2 className="font-semibold">Sample Text</h2>
              <div className="flex items-center gap-2">
                <label htmlFor="textScale" className="text-sm">
                  Text Size {textScale}%
                </label>
                <input
                  id="textScale"
                  type="range"
                  min={85}
                  max={160}
                  step={5}
                  value={textScale}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setTextScale(v);
                    announce(`Text size ${v}%`);
                  }}
                  className="w-40 accent-indigo-600"
                />
              </div>
            </div>

            <div className="rounded-lg border p-4 bg-white" style={sampleStyle}>
              <div className={sampleTextClass}>
                <p><strong>Heading:</strong> Accessible events for everyone.</p>
                <p>
                  This paragraph scales with the slider above. Use <kbd>Tab</kbd> to test focus outlines if “Thick Focus” is on.
                </p>
                <p>
                  Contrast, font, and filters are independent of the rest of the app.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Us (mock behavior, no visible “mock” text) */}
          <section className="rounded-xl border bg-white/60 dark:bg-black/20 p-4">
            <h2 className="font-semibold mb-3">Contact Us</h2>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Submitted (demo only). No data is sent.");
              }}
              aria-label="Contact Us"
            >
              <div>
                <label htmlFor="name" className="block mb-1 font-medium">Name</label>
                <input id="name" type="text" className={fieldClass} placeholder="Enter your name" />
              </div>

              <div>
                <label htmlFor="message" className="block mb-1 font-medium">Message</label>
                <textarea id="message" className={fieldClass} placeholder="Type your message" rows={4} />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className={cx(
                    "rounded-lg px-4 py-2 font-medium transition border",
                    highContrast
                      ? "bg-yellow-400 text-black hover:bg-yellow-300 border-yellow-500"
                      : "bg-indigo-600 text-white hover:bg-indigo-700 border-indigo-600",
                    "focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  )}
                >
                  Submit
                </button>
                <button
                  type="reset"
                  className="rounded-lg px-4 py-2 border hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                  Reset
                </button>
              </div>
            </form>
          </section>
        </div>

        {/* SR live region */}
        <div aria-live="polite" aria-atomic="true" className="sr-only" ref={liveRef} />
      </div>
    </>
  );
}
