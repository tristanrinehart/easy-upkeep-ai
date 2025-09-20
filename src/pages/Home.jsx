// src/pages/Home.jsx
// Uses the optimistic ItemList you want (item shows instantly; tasks fetched in the background).

import ItemList from "../components/ItemList";

export default function Home() {
  return (
    <div>
      <ItemList />
    </div>
  );
}

/**
 * Home page (protected)
 * - Shows: add item form, item list (cards).
 * - Shows non-blocking banner when daily 100 generated tasks limit is hit.
 
import React, { useEffect, useState } from "react";
import api from "../utils/api.js";
import ItemCard from "../components/ItemCard.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import "../styles/Home.css";

export default function Home() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);
  const [banner, setBanner] = useState(null);
  const [form, setForm] = useState({ name: "", model: "" });
  const [submitting, setSubmitting] = useState(false);

  async function fetchItems() {
    try {
      const res = await api.get("/items");
      setItems(res.data.items || []);
    } catch (e) {
      setError(e?.response?.data || { message: e.message });
    }
  }

  useEffect(() => { fetchItems(); }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post("/items", { name: form.name, model: form.model || undefined });
      // backend should trigger OpenAI task generation (scaffold)
      // non-blocking banner if over limit
      if (res.data?.banner) setBanner(res.data.banner);
      await fetchItems();
      setForm({ name: "", model: "" });
    } catch (e) {
      setError(e?.response?.data || { message: e.message });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    try {
      await api.delete(`/items/${id}`);
      await fetchItems();
    } catch (e) {
      setError(e?.response?.data || { message: e.message });
    }
  }

  return (
    <div className="home">
      {banner && <div className="banner">{banner}</div>}

      <form className="add-item-form" onSubmit={onSubmit}>
        <label>Item name (required)
          <input type="text" required value={form.name} onChange={(e) => setForm(s => ({ ...s, name: e.target.value }))} />
        </label>
        <label>Model number (optional)
          <input type="text" value={form.model} onChange={(e) => setForm(s => ({ ...s, model: e.target.value }))} />
        </label>
        <button type="submit" disabled={submitting}>
          Add item {submitting && <LoadingSpinner label="Adding item" />}
        </button>
      </form>

      <section aria-label="Your maintenance items">
        {error && <div className="error">Error: {error.message || "Unknown error"}</div>}
        {!items ? <LoadingSpinner label="Loading items" /> : (
          items.length === 0 ? <p>Add your maintenance items</p> : (
            items.map((it) => <ItemCard key={it._id} item={it} onDelete={handleDelete} />)
          )
        )}
      </section>
    </div>
  );
}
  */