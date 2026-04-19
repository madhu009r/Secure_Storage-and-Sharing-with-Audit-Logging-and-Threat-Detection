import api from "./axios"
import type { SecurityAlert } from "../types/alert"

export const fetchSecurityAlerts = async (): Promise<SecurityAlert[]> => {
  const res = await api.get("/admin/security/alerts")
  return res.data
}
