import { useState } from "react";

const API_URL = "http://localhost:3000/api/groups";

export default function GroupDescription({ group, onUpdate }) {
  const [description, setDescription] = useState(group.description || "");
  const [saving, setSaving] = useState(false);

  const saveDescription = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/${group.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });

      const updated = await res.json();
      onUpdate(updated);
    } catch (err) {
      console.error(err);
      alert("Failed to update description");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h3>Description</h3>

      <textarea
        rows="4"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button onClick={saveDescription} disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
