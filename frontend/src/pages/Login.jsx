import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
export default function Login(){
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username:'', password:'' });
  const [error, setError] = useState(null);
  async function submit(e){ e.preventDefault(); setError(null); const res = await login(form); if (res.ok) navigate('/'); else setError(res.error?.message || JSON.stringify(res.error)); }
  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded shadow">
      <h1 className="text-2xl mb-4">Login</h1>
      <form onSubmit={submit}>
        <label className="block">Username<input value={form.username} onChange={e=>setForm(s=>({...s, username:e.target.value}))} required className="w-full border px-2 py-1 mt-1" /></label>
        <label className="block mt-2">Password<input type="password" value={form.password} onChange={e=>setForm(s=>({...s, password:e.target.value}))} required className="w-full border px-2 py-1 mt-1" /></label>
        {error && <div role="alert" className="text-red-600 mt-2">{error}</div>}
        <button className="btn-primary mt-4" type="submit">Login</button>
      </form>
    </div>
  );
}
