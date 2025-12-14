import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      console.log("RAW RESPONSE:", res); // Log the raw response
      console.log("RESPONSE STATUS:", res.status); // Check HTTP status

      const data = await res.json();

      console.log("RESPONSE JSON:", data); // Log parsed JSON
      console.log("data.success type:", typeof data.success);
      console.log("data.success value:", data.success);

      if (data.success) {
        console.log("SUCCESS TRUE — saving user info and redirecting");
        if (data.userId) {
          localStorage.setItem('userId', data.userId);
        }
        if (data.displayName) {
          localStorage.setItem('displayName', data.displayName);
        }
        setMessage("Login successful!");
        navigate("/home");
      } else {
        console.log("SUCCESS FALSE — stay on login page");
        setMessage(data.message || 'Virhe kirjautumisessa');
      }

    } catch (err) {
      console.error("Login fetch failed:", err);
      setMessage("Network error: " + err.message);
    }
  };

  return (
  <div className="auth-wrapper">
  <form onSubmit={handleSubmit} className="auth-card">
    <input
      name="email"
      value={form.email}
      onChange={handleChange}
      placeholder="Sähköposti"
      className="auth-input"
    />
    <input
      name="password"
      type="password"
      value={form.password}
      onChange={handleChange}
      placeholder="Salasana"
      className="auth-input"
    />
    <button type="submit" className="btn btn-block">
      Kirjaudu
    </button>
    <div className="auth-message error">{message}</div>
  </form>
  </div>
);
}
