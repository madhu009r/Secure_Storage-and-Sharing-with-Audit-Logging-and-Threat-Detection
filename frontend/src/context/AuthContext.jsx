import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
const AuthContext = createContext();
let inMemoryToken = null;
export function getAuthToken(){ return inMemoryToken || localStorage.getItem('sfs_token'); }
export function clearAuth(){ inMemoryToken = null; localStorage.removeItem('sfs_token'); }
export function AuthProvider({ children }){
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const token = getAuthToken();
    if (token){
      api.get('/api/auth/profile').then(r => setUser(r.data)).catch(() => clearAuth());
    }
    function onUnauth(){ setUser(null); }
    window.addEventListener('sfs:unauthorized', onUnauth);
    return () => window.removeEventListener('sfs:unauthorized', onUnauth);
  }, []);
  async function login({ username, password }){
    setLoading(true);
    try{
      const res = await api.post('/api/auth/login', { username, password });
      const t = res.data.token;
      inMemoryToken = t;
      localStorage.setItem('sfs_token', t);
      const profile = await api.get('/api/auth/profile');
      setUser(profile.data);
      return { ok: true };
    }catch(err){
      return { ok: false, error: err.response?.data || err.message };
    }finally{ setLoading(false); }
  }
  async function register({ username, password }){
    setLoading(true);
    try{ await api.post('/api/auth/register', { username, password }); return { ok: true }; }
    catch(err){ return { ok: false, error: err.response?.data || err.message }; }
    finally{ setLoading(false); }
  }
  function logout(){ clearAuth(); setUser(null); }
  return <AuthContext.Provider value={{ user, login, logout, register, loading }}>{children}</AuthContext.Provider>;
}
export function useAuth(){ return useContext(AuthContext); }
