import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Account() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      setError("You need to log in to view your account.");
      setLoading(false);
      return;
    }

    const idNum = Number(userId);
    if (!Number.isInteger(idNum) || idNum <= 0) {
      setError("Invalid user id saved locally.");
      setLoading(false);
      return;
    }

    async function loadUser() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("http://localhost:3000/api/users");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch users");
        }

        const users = data.users || [];
        const found = users.find((u) => u.id === idNum);

        if (!found) {
          setError("User not found.");
        } else {
          setUser(found);
        }
      } catch (err) {
        console.error("Account load error:", err);
        setError(err.message || "Failed to load account");
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const handleDeleteAccount = async () => {
    if (!user) return;

    const ok = window.confirm(
      "Are you sure you want to delete your account? This cannot be undone."
    );
    if (!ok) return;

    try {
      const res = await fetch(`http://localhost:3000/api/users/${user.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Delete user error:", data);
        alert(data.message || "Failed to delete account");
        return;
      }

      localStorage.removeItem("userId");
      localStorage.removeItem("displayName");

      alert("Account deleted successfully.");

      navigate("/home");
    } catch (err) {
      console.error("Delete user failed:", err);
      alert("Unexpected error when deleting account");
    }
  };

  if (loading) {
    return (
      <section className="container">
        <h2>User info</h2>
        <p>Loading...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container">
        <h2>User info</h2>
        <p className="account-error">{error}</p>
        <Link to="/login" className="btn">
          Go to login
        </Link>
      </section>
    );
  }

  return (
    <section className="container">
      <h2>User info</h2>
      <div className="user-card">
        <p>
          <strong>Display name:</strong> {user.display_name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <button
          type="button"
          className="btn"
          onClick={handleDeleteAccount}
        >
          Delete account
        </button>
      </div>
    </section>
  );
}
