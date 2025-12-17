import { useEffect, useState } from "react";
import GroupCard from "../components/GroupCard";
import CreateGroupForm from "../components/CreateGroupForm";

const API_URL = "http://localhost:3000/api/groups";

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then(setGroups)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  
  const removeGroupFromState = (id) => {
    setGroups((prevGroups) => prevGroups.filter((g) => g.id !== id));
  };

  if (loading) return <p>Loading groups...</p>;

  return (
    <div>
      <CreateGroupForm />

      <h2>Groups</h2>

      {groups.length === 0 ? (
        <p>No groups found.</p>
      ) : (
        groups.map((group) => (
          <GroupCard
            key={group.id}
            group={group}
            onDelete={removeGroupFromState} 
          />
        ))
      )}
    </div>
  );
}
