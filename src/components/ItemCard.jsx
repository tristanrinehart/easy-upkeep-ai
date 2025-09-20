// src/components/ItemCard.jsx
// See Tasks button: centered label, centered spinner, no text while loading.
// Delete button visually matches See Tasks height/background.

import { useId, useState } from "react";
import TaskList from "./TaskList";
import "../styles/ItemCard.css";

export default function ItemCard({
  item,
  // tasksState: { status: 'idle' | 'loading' | 'ready' | 'error', tasks: [], error: null }
  tasksState = { status: "idle", tasks: [], error: null },
  onDelete,
}) {
  const [expanded, setExpanded] = useState(false);
  const panelId = useId();

  const status = tasksState.status || "idle";
  const tasks = Array.isArray(tasksState.tasks) ? tasksState.tasks : [];
  const error = tasksState.error;

  const isUnsaved = !!item?.__unsaved;
  const isLoading = status === "loading";
  const isReady = status === "ready";
  const isError = status === "error" || status === "idle";

  const onSeeTasks = () => {
    if (!isReady) return; // only toggle after tasks are loaded
    setExpanded((e) => !e);
  };

  const btnDisabled = !isReady || isUnsaved || isLoading;

  const btnTitle =
    isUnsaved
      ? "This item hasn't saved yet."
      : isLoading
      ? "Loading tasks..."
      : !isReady
      ? "Tasks are not loaded yet."
      : (expanded ? "Hide tasks" : "See tasks");

  const labelText = expanded ? "Hide tasks" : "See tasks";

  return (
    <article className="itemcard">
      <div className="itemcard__row">
        <div className="itemcard__main">
          <div className="itemcard__title">
            {item?.name || "Untitled item"}
            {isUnsaved && (
              <span className="chip chip-warn" title="Not saved to server">
                UNSAVED
              </span>
            )}
          </div>
          {item?.model && <div className="itemcard__sub">Model: {item.model}</div>}
        </div>

        <div className="itemcard__actions">
          <button
            type="button"
            className="seeTasks"
            aria-expanded={isReady ? expanded : false}
            aria-controls={panelId}
            onClick={onSeeTasks}
            disabled={btnDisabled}
            aria-busy={isLoading ? "true" : "false"}
            title={btnTitle}
            aria-label={isLoading ? "Loading tasks" : labelText}
          >
            {isLoading ? (
              // Spinner only while loading (no text shown)
              <span className="spinner" aria-hidden="true" />
            ) : (
              <span className="label">{labelText}</span>
            )}
          </button>

          <button
            type="button"
            className="dangerIcon"
            aria-label={`Delete ${item?.name || "item"}`}
            onClick={() => onDelete?.(item?._id)}
            title="Delete item"
          >
            🗑️
          </button>
        </div>
      </div>

      <div
        id={panelId}
        className={`itemcard__panel ${expanded ? "open" : "closed"}`}
        role="region"
        aria-label={`Tasks for ${item?.name || "this item"}`}
      >
        {status === "error" && (
          <div className="error">{error || "Failed to load tasks."}</div>
        )}

        {isReady && tasks.length === 0 && (
          <div className="muted">No tasks available for this item.</div>
        )}

        {isReady && tasks.length > 0 && <TaskList tasks={tasks} />}
      </div>
    </article>
  );
}
