import type { JSX } from "react"
import { Navigate } from "react-router-dom"

export default function AdminRoute({ children }: { children: JSX.Element }) {
  const role = sessionStorage.getItem("role")

  if (role !== "ADMIN") {
    return <Navigate to="/" />
  }
  return children
}
