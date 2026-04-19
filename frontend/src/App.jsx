import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Files from './pages/Files';
import Share from './pages/Share';
import Audit from './pages/Audit';
import Threats from './pages/Threats';
import Admin from './pages/Admin';

function Protected({ children }) {
  const token = localStorage.getItem('sfs_token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={<Protected><Dashboard /></Protected>} />
          <Route path="/files" element={<Protected><Files /></Protected>} />
          <Route path="/share" element={<Protected><Share /></Protected>} />
          <Route path="/audit" element={<Protected><Audit /></Protected>} />
          <Route path="/threats" element={<Protected><Threats /></Protected>} />
          <Route path="/admin" element={<Protected><Admin /></Protected>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
