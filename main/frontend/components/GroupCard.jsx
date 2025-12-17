import { Link } from "react-router-dom";

export default function GroupCard({ group, onDelete, currentUserId, token }) {
  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${group.name}"?`)) return;

    try {
      const res = await fetch(
        `http://localhost:3000/api/groups/${group.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to delete group");

      onDelete(group.id);
    } catch (err) {
      console.error(err);
      alert("Error deleting group");
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
      <h3>{group.name}</h3>
      <p>{group.description || "No description yet"}</p>

      <Link to={`/groups/${group.id}`} style={{ marginRight: "1rem" }}>
        View Group
      </Link>

      {/* show only to owner */}
      {group.owner_id === currentUserId && (
        <button onClick={handleDelete} style={{ color: "red" }}>
          Delete
        </button>
      )}
    </div>
  );
}
