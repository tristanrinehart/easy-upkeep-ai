/**
 * CalendarButtons.jsx
 * - Three buttons: standard ICS download, Apple Calendar (same ICS), Google Calendar link.
 * - Uses next Saturday 9am; duration minutes provided.
 * - For Google, crafts a calendar URL.
 */
import React, { useMemo } from "react";
import { nextSaturdayNineAM } from "../utils/date.js";
import "../styles/CalendarButtons.css";

export default function CalendarButtons({ task }) {
  const start = useMemo(() => nextSaturdayNineAM(), []);
  const durationMinutes = parseInt((task.durationMinutes ?? 60), 10);
  const end = new Date(start.getTime() + durationMinutes * 60000);

  const title = encodeURIComponent(task.taskName || "Maintenance Task");
  const details = encodeURIComponent(task.description || "");
  const location = encodeURIComponent("Home");
  const dtStart = start.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const dtEnd = end.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const calendarName = "Easy Upkeep AI";

  function buildICS() {
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      `X-WR-CALNAME:${calendarName}`,
      "PRODID:-//Easy Upkeep AI//EN",
      "BEGIN:VEVENT",
      `UID:${crypto.randomUUID ? crypto.randomUUID() : Date.now()}`,
      `DTSTAMP:${dtStart}`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${details}`,
      `CATEGORIES:priority-${task.priority}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");
    return ics;
  }

  function downloadICS() {
    const ics = buildICS();
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "easy-upkeep-task.ics";
    a.click();
    URL.revokeObjectURL(url);
  }

  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${dtStart}/${dtEnd}&location=${location}`;

  return (
    <div className="calendar-buttons">
      <button onClick={downloadICS} aria-label="Download ICS">ICS</button>
      <button onClick={downloadICS} aria-label="Add to Apple Calendar">Apple</button>
      <a href={googleUrl} target="_blank" rel="noreferrer" className="google-btn" aria-label="Add to Google Calendar">Google</a>
    </div>
  );
}