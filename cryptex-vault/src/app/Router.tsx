import { Routes, Route } from "react-router-dom"
import Login from "../auth/Login"
import Register from "../auth/Register"
import FileList from "../files/FileList"
import Alerts from "../admin/Alerts"
import AccountLocked from "../security/AccountLocked"
import ProtectedRoute from "./ProtectedRoute"
import AdminRoute from "./AdminRoute"

export default function Router() {
  return (
    <Routes>

      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/security-blocked" element={<AccountLocked />} />

      {/* User Dashboard */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <FileList />
          </ProtectedRoute>
        }
      />

      {/* Admin */}
      <Route
        path="/admin/alerts"
        element={
          <AdminRoute>
            <Alerts />
          </AdminRoute>
        }
      />

    </Routes>
  )
}
