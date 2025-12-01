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
    <form onSubmit={handleSubmit}>
      <input name="email" value={form.email} onChange={handleChange} placeholder="Sähköposti" />
      <input name="displayName" value={form.displayName} onChange={handleChange} placeholder="Käyttäjänimi" />
      <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Salasana" />
      <button type="submit">Rekisteröidy</button>
      <div>{message}</div>
    </form>
  );
}
