// src/components/AddItemForm.jsx
// A dumb form that never sets a loading state on its button.
// It calls onCreate({ name, model }) and immediately clears the inputs.

import { useState } from "react";
import "../styles/AddItemForm.css";

export default function AddItemForm({ onCreate }) {
  const [name, setName] = useState("");
  const [model, setModel] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const n = name.trim();
    const m = model.trim();
    if (!n) return;
    // fire-and-forget upwards; this component never enters "loading"
    onCreate?.({ name: n, model: m || "" });
    // clear instantly
    setName("");
    setModel("");
  };

  return (
    <form className="addItemForm" onSubmit={submit} noValidate>
      <div className="field">
        <label htmlFor="name">
          Maintenance item name<span aria-hidden="true"> *</span>
        </label>
        <input
          id="name"
          name="name"
          required
          placeholder="e.g., Clothes Washer"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="off"
        />
      </div>

      <div className="field">
        <label htmlFor="model">Model number (optional)</label>
        <input
          id="model"
          name="model"
          placeholder="e.g., WA54R7200AV/US"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          autoComplete="off"
        />
      </div>

      {/* never shows a spinner; no aria-busy; no "loading" classes */}
      <button
        type="submit"
        className="addButton"
        data-no-spinner="true"
        title="Add item"
      >
        Add Item
      </button>
    </form>
  );
}
