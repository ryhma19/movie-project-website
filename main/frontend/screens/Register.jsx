import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ email: '', displayName: '', password: '' });
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetch('http://localhost:3000/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    console.log("API response", data);
    if (data.success) {
      if (data.userId) {
        localStorage.setItem('userId', data.userId);
      }
      if (form.displayName) {
        localStorage.setItem('displayName', form.displayName);
      }
      setSuccess(true);
    } else {
      setMessage(data.message || 'Virhe rekisteröinnissä');
    }
  };

  useEffect(() => {
    console.log("Success state changed:", success);
    if (success) {
      navigate("/home");
    }
  }, [success, navigate]);

  return (
  <form onSubmit={handleSubmit} className="auth-card">
    <input
      name="email"
      value={form.email}
      onChange={handleChange}
      placeholder="Sähköposti"
      className="auth-input"
    />
    <input
      name="displayName"
      value={form.displayName}
      onChange={handleChange}
      placeholder="Käyttäjänimi"
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
      Rekisteröidy
    </button>
    <div className="auth-message error">{message}</div>
  </form>
);
}
