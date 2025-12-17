import { useState } from "react";

const API_URL = "http://localhost:3000/api/groups";

export default function GroupDescription({ group, onUpdate }) {
  const [description, setDescription] = useState(group.description || "");
  const [saving, setSaving] = useState(false);

  const saveDescription = async () => {
    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in again.");

      const res = await fetch(`${API_URL}/${group.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify({ description }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || data?.message || "Failed to update description");
      }

      onUpdate(data);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to update description");
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
