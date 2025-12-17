import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GroupDescriptionEditor from "../components/GroupDescriptionEditor.jsx";

const API_URL = "http://localhost:3000/api/groups";

export default function GroupDetail({ currentUserId }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await fetch(`${API_URL}/${id}`);
        if (!res.ok) throw new Error("Failed to fetch group");
        const data = await res.json();
        setGroup(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchGroup();
  }, [id]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch(`${API_URL}/${id}/members`);
        if (!res.ok) throw new Error("Failed to fetch members");
        const data = await res.json();
        setMembers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [id]);

  if (!group || loading) return <p>Loading...</p>;

  
  const storedId = Number(localStorage.getItem("userId"));
  const propId = Number(currentUserId);
  const currentId = Number.isFinite(propId) ? propId : storedId;

  if (!Number.isFinite(currentId)) {
    return <p>Please log in again.</p>;
  }

  const ownerId = Number(group.owner_id);

  const isMember = members.some((m) => Number(m.id) === currentId);
  const isOwner = ownerId === currentId;

  const refetchMembers = async () => {
    const updatedMembers = await fetch(`${API_URL}/${id}/members`).then((r) =>
      r.json()
    );
    setMembers(updatedMembers);
  };

  const handleJoin = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in again.");

      const res = await fetch(`${API_URL}/add-member`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ groupId: group.id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to join group");

      await refetchMembers();
      alert(`You joined "${group.name}"!`);
    } catch (err) {
      console.error(err);
      alert(err.message || "Error joining group");
    }
  };

  const handleLeave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in again.");

      const res = await fetch(`${API_URL}/remove-member`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ groupId: group.id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to leave group");

      await refetchMembers();
      alert(`You left "${group.name}".`);
    } catch (err) {
      console.error(err);
      alert(err.message || "Error leaving group");
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in again.");

      const ok = window.confirm(
        `Delete group "${group.name}"? This cannot be undone.`
      );
      if (!ok) return;

      const res = await fetch(`${API_URL}/${group.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to delete group");

      alert("Group deleted");
      navigate("/groups");
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to delete group");
    }
  };

  const ownerName =
    members.find((m) => Number(m.id) === ownerId)?.display_name ||
    `User ${ownerId}`;

  return (
    <div>
      <h1>{group.name}</h1>

      <GroupDescriptionEditor group={group} onUpdate={setGroup} />

      {/* join */}
      {!isMember && !isOwner && <button onClick={handleJoin}>Join Group</button>}

      {/* leave */}
      {isMember && !isOwner && (
        <button onClick={handleLeave} style={{ marginLeft: 8 }}>
          Leave Group
        </button>
      )}

      {/* delete */}
      {isOwner && (
        <button onClick={handleDelete} style={{ marginLeft: 8 }}>
          Delete Group
        </button>
      )}

      <h3>Members:</h3>
      <ul>
        {members.map((m) => (
          <li key={m.id}>
            {Number(m.id) === currentId
              ? "You"
              : m.display_name || `User ${m.id}`}
          </li>
        ))}
      </ul>

      <p>
        <strong>Owner:</strong> {isOwner ? "You" : ownerName}
      </p>
    </div>
  );
}
