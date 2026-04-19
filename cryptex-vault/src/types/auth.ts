export interface LoginResponse {
  token: string
  role: "USER" | "ADMIN"
  riskScore?: number
  block?: boolean
  reason?: string
}
