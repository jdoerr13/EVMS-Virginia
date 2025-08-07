/**
 * Download events as a CSV file
 */
export function downloadCSV(events) {
  const headers = ["Title", "College", "Venue", "Date", "Status", "Requester"];
  const rows = events.map(e => [
    e.title,
    e.college,
    e.venue,
    e.date,
    e.status,
    e.requester || "",
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "events.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


/**
 * Parse uploaded CSV and convert to event objects
 */
export function parseCSV(file, callback, onError) {
  const reader = new FileReader();

  reader.onload = (e) => {
    const lines = e.target.result.split("\n").filter(Boolean);
    const [headerLine, ...dataLines] = lines;

    const expectedHeaders = ["Title", "College", "Venue", "Date", "Status", "Requester"];
    const actualHeaders = headerLine.split(",").map((h) => h.trim());

    const isValid = expectedHeaders.every((h, i) => h === actualHeaders[i]);
    if (!isValid) {
      onError?.("Invalid CSV format. Expected headers: " + expectedHeaders.join(", "));
      return;
    }

    const parsed = dataLines.map((line) => {
      const [title, college, venue, date, status, requester] = line.split(",");

      return {
        id: Date.now() + Math.random(),
        title: title?.trim() || "Untitled Event",
        college: college?.trim() || "Unknown College",
        venue: venue?.trim() || "Unspecified",
        date: date?.trim() || "",
        status: status?.trim() || "Pending",
        requester: requester?.trim() || "",
      };
    });

    callback(parsed);
  };

  reader.readAsText(file);
}