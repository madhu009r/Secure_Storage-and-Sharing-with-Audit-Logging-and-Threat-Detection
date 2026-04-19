import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import ProtectedRoute from './components/layout/ProtectedRoute.jsx';
import MainLayout from './components/layout/MainLayout.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import MyFiles from './pages/MyFiles.jsx';
import FileVersions from './pages/FileVersions.jsx';
import ShareLinks from './pages/ShareLinks.jsx';
import PublicShare from './pages/PublicShare.jsx';
import AuditLogs from './pages/AuditLogs.jsx';
import ThreatDetection from './pages/ThreatDetection.jsx';
import Admin from './pages/Admin.jsx';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/share/:token" element={<PublicShare />} />

          <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <MainLayout />
                      </ProtectedRoute>
                }
            >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="my-files" element={<MyFiles />} />
            {/* <Route path="file-versions" element={<FileVersions />} /> */}
            <Route path="share-links" element={<ShareLinks />} />
            <Route path="audit-logs" element={<AuditLogs />} />
            <Route path="threat-detection" element={<ThreatDetection />} />
            <Route
              path="admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Admin />
                </ProtectedRoute>
              }
            />
          </Route>

              <Route
                    path="*"
                    element={
                      <ProtectedRoute>
                        <Navigate to="/dashboard" replace />
                      </ProtectedRoute>
                    }
                  />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
