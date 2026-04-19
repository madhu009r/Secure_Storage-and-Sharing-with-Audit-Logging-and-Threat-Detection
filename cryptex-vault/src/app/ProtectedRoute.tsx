import { Navigate } from "react-router-dom"
import { getToken } from "../utils/token"
import type { JSX } from "react"

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  if (!getToken()) {
    return <Navigate to="/login" />
  }
  return children
}
