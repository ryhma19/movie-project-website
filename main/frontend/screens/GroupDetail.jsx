import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GroupDescriptionEditor from "../components/GroupDescriptionEditor.jsx";

const API_URL = "http://localhost:3000/api/groups";

export default function GroupDetail({ currentUserId }) {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch group data
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

  // Fetch group members
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

  const isMember = members.some((m) => m.id === currentUserId);
  const isOwner = group.owner_id === currentUserId;

  const handleJoin = async () => {
    try {
      const res = await fetch(`${API_URL}/add-member`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId: group.id, userId: currentUserId }),
      });
      if (!res.ok) throw new Error("Failed to join group");

      // Refetch members to include the new member
      const updatedMembers = await fetch(`${API_URL}/${id}/members`).then((r) => r.json());
      setMembers(updatedMembers);

      alert(`You joined "${group.name}"!`);
    } catch (err) {
      console.error(err);
      alert("Error joining group");
    }
  };

  return (
    <div>
      <h1>{group.name}</h1>

      <GroupDescriptionEditor group={group} onUpdate={setGroup} />

      {/* Join button (only if not a member and not the owner) */}
      {!isMember && !isOwner && (
        <button onClick={handleJoin}>Join Group</button>
      )}

      <h3>Members:</h3>
      <ul>
        {members.map((m) => (
          <li key={m.id}>{m.display_name || `User ${m.id}`}</li>
        ))}
      </ul>

      {/* Optionally show owner info */}
      <p><strong>Owner:</strong> {isOwner ? "You" : members.find(m => m.id === group.owner_id)?.display_name || `User ${group.owner_id}`}</p>
    </div>
  );
}
