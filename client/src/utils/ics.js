// src/utils/ics.js
function dt(date, time = "00:00") {
  // expects "YYYY-MM-DD" and "HH:mm"
  const [Y, M, D] = date.split("-").map(Number);
  const [h, m] = (time || "00:00").split(":").map(Number);
  return `${Y}${String(M).padStart(2,"0")}${String(D).padStart(2,"0")}T${String(h).padStart(2,"0")}${String(m).padStart(2,"0")}00`;
}

export function icsForEvent(e) {
  const uid = `ev-${e.id}@evms.local`;
  const dtStart = dt(e.date, e.startTime);
  const dtEnd = dt(e.date, e.endTime);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//EVMS Demo//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dt(new Date().toISOString().slice(0,10))}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${(e.title || "").replace(/,/g,"")}`,
    `LOCATION:${(e.venue || "").replace(/,/g,"")}`,
    `DESCRIPTION:${(e.description || "").replace(/[\r\n,]/g," ")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n");
}

export function icsForEvents(list) {
  const chunks = list.map(icsForEvent).map(s => s.split("\r\n").slice(5, -2)); // strip headers/footers
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//EVMS Demo//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...chunks.flat().map((l,i)=> i%100===0 && l==="BEGIN:VEVENT" ? l : l),
    "END:VCALENDAR",
  ];
  // simpler: actually rebuild properly
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//EVMS Demo//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...list.map(icsForEvent).map(s => s.split("\r\n").slice(5,-2)).flat().map(l=>l==="BEGIN:VEVENT"||l==="END:VEVENT"?l:l),
    "END:VCALENDAR",
  ].join("\r\n");
}

export function download(filename, text) {
  const blob = new Blob([text], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
