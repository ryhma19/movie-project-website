import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3000/api/groups";

export default function CreateGroupForm() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, ownerId: 1 }), // replace 1 with logged-in user ID
      });

      if (!res.ok) {
        const text = await res.text(); // get error message
        throw new Error(`Server error: ${text}`);
      }

      const data = await res.json();
      if (!data.id) throw new Error("Invalid response from server");

      navigate(`/groups/${data.id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to create group: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Group</h2>

      <input
        type="text"
        placeholder="Group name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create"}
      </button>
    </form>
  );
}
