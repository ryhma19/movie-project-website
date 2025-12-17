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
      const token = localStorage.getItem("token"); 

      if (!token) {
        throw new Error("No token found. Please log in again.");
      }

      const res = await fetch(`${API_URL}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json(); // read json 

      if (!res.ok) {
        throw new Error(data?.error || "Failed to create group");
      }

      navigate(`/groups/${data.id}`);
    } catch (err) {
      console.error(err);
      alert(err.message);
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
        className="auth-input"
      />

      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create"}
      </button>
    </form>
  );
}
