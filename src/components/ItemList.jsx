// src/components/ItemList.jsx
import React, { useEffect, useRef, useState } from "react";
import { api } from "../utils/api.js";
import ItemCard from "./ItemCard.jsx"; // your external ItemCard that imports its own CSS
import "../styles/ItemList.css";

// --- helpers to keep polling tidy ---
function isPending(item) {
  return item?.genStatus === "pending" && (!item.tasks || item.tasks.length === 0);
}

export default function ItemList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // track active polls so we don't start duplicates
  const polling = useRef(new Set());
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    (async () => {
      try {
        const res = await api.getItemsAndTasks();
        const data = Array.isArray(res.data?.items) ? res.data.items : [];
        setItems(data);

        // start one poll per pending item (no duplicates)
        for (const it of data) {
          if (isPending(it)) startPoll(it._id);
        }
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      alive.current = false;
      polling.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // create: append immediately + start polling just for that item
  async function handleCreated(item) {
    setItems((prev) => [{ ...item, tasks: [] }, ...prev]);
    startPoll(item._id);
  }

  // delete by id (ItemCard calls onDelete with id)
  async function handleDelete(id) {
    await api.deleteItem(id);
    setItems((prev) => prev.filter((i) => String(i._id) !== String(id)));
    polling.current.delete(String(id));
  }

  // Long-poll tasks until they exist or generator fails
  async function startPoll(itemId) {
    const key = String(itemId);
    if (polling.current.has(key)) return; // already polling
    polling.current.add(key);

    try {
      let keepGoing = true;
      while (keepGoing && alive.current) {
        // wait=1 => backend blocks up to ~45s, returns:
        // 200 { tasks }, 202 { pending: true }, or 409 { error }
        const res = await api.getTasksByItem(key, { wait: true }).catch((err) => {
          // 409 -> Axios throws; surface status + data
          const status = err?.response?.status;
          const data = err?.response?.data;
          if (status === 409) {
            // mark item as failed with error
            setItems((prev) =>
              prev.map((it) =>
                String(it._id) === key ? { ...it, genStatus: "failed", genError: data?.error || "Task generation failed" } : it
              )
            );
            keepGoing = false;
            return null;
          }
          // transient network errors: retry after short delay
          return null;
        });

        if (!alive.current) break;

        if (res && res.status === 200 && Array.isArray(res.data?.tasks)) {
          const tasks = res.data.tasks;
          setItems((prev) =>
            prev.map((it) =>
              String(it._id) === key ? { ...it, tasks, genStatus: "ready", genError: null } : it
            )
          );
          keepGoing = false; // done
        } else {
          // 202 or null -> short delay before trying again
          await new Promise((r) => setTimeout(r, 1000));
        }
      }
    } finally {
      polling.current.delete(key);
    }
  }

  return (
    <section className="itemlist">
      <AddItemForm onCreated={handleCreated} />

      {loading ? (
        <p className="muted">Loading your items…</p>
      ) : items.length === 0 ? (
        <p className="empty">Add your maintenance items</p>
      ) : (
        <div className="itemlist__list">
          {items.map((it) => (
            <ItemCard
              key={it._id}
              item={it}
              tasksState={{
                status: isPending(it) ? "loading" : it.genStatus === "failed" ? "error" : "ready",
                tasks: it.tasks || [],
                error: it.genError || null,
              }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function AddItemForm({ onCreated }) {
  const [name, setName] = useState("");
  const [model, setModel] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    try {
      const res = await api.createItem({ name: name.trim(), model: model.trim() || "" });
      const item = res.data.item;
      onCreated?.(item); // appear immediately
      setName("");
      setModel("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="itemlist__form" onSubmit={submit} aria-label="Add maintenance item">
      <div className="field">
        <label htmlFor="name">Item name *</label>
        <input
          id="name"
          type="text"
          required
          placeholder="e.g., Washing Machine"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="model">Model (optional)</label>
        <input
          id="model"
          type="text"
          placeholder="e.g., WA54R7200AV/US"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        />
      </div>

      {/* No spinner on this button — per your requirement */}
      <button type="submit" className="primary" disabled={submitting} aria-busy={submitting ? "true" : "false"}>
        {submitting ? "Adding…" : "Add Item"}
      </button>
    </form>
  );
}
