// src/components/TaskList.jsx
import React from "react";
import "../styles/TaskList.css";

/**
 * Expects tasks with:
 * taskName, description, priority (1-10), frequency, duration,
 * who, difficulty, steps[], tools[],
 * manufacturerSnippet?, manufacturerSourceUrl?, manufacturerDocTitle?
 * (durationMinutes, frequencyInWeeks exist but are not displayed)
 */
function priorityWord(p) {
  const n = Number(p);
  if (n >= 1 && n <= 3) return "critical";
  if (n >= 4 && n <= 7) return "recommended";
  return "optional";
}

export default function TaskList({ tasks = [] }) {
  if (!Array.isArray(tasks) || tasks.length === 0) {
    return <p className="muted">No tasks yet.</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((t, idx) => (
        <li key={t._id || idx} className="task">
          <div className="task-head">
            <span className="task-name">{t.taskName}</span>
            <div className="task-right">
              {/* priority: word only */}
              <span className={`task-priority p-${t.priority}`}>
                {priorityWord(t.priority)}
              </span>
            </div>
          </div>

          <div className="task-body">
            {/* WHO: banner style spanning full width when professional */}
            {t.who === "professional" && (
              <div className="pro-banner" role="note" aria-label="Professional only">
                Professional only
              </div>
            )}

            {t.description && <p className="task-desc">{t.description}</p>}

            {/* meta chips */}
            <div className="task-chips" role="list">
              {t.frequency && (
                <span className="chip chip-meta" role="listitem">
                  Frequency: {t.frequency}
                </span>
              )}
              {t.duration && (
                <span className="chip chip-meta" role="listitem">
                  Duration: {t.duration}
                </span>
              )}
              {t.difficulty && (
                <span className="chip chip-meta" role="listitem">
                  Difficulty: {t.difficulty}
                </span>
              )}
              {/* intentionally hiding: who=owner, frequencyInWeeks, durationMinutes */}
            </div>

            {Array.isArray(t.steps) && t.steps.length > 0 && (
              <>
                <div className="subhead">Steps</div>
                <ol className="steps">
                  {t.steps.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ol>
              </>
            )}

            {Array.isArray(t.tools) && t.tools.length > 0 && (
              <>
                <div className="subhead">Tools &amp; Materials</div>
                <ul className="tools">
                  {t.tools.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </>
            )}

            {(t.manufacturerSnippet || t.manufacturerSourceUrl || t.manufacturerDocTitle) && (
              <div className="oem">
                {t.manufacturerDocTitle && (
                  <div className="oem-title">{t.manufacturerDocTitle}</div>
                )}
                {t.manufacturerSnippet && (
                  <blockquote className="oem-quote">“{t.manufacturerSnippet}”</blockquote>
                )}
                {t.manufacturerSourceUrl && (
                  <a
                    className="oem-link"
                    href={t.manufacturerSourceUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Manufacturer source
                  </a>
                )}
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
