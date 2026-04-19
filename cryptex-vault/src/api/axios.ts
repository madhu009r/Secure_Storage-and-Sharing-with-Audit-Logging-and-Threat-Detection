import axios from "axios"
import { getToken, clearToken } from "../utils/token"

const api = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 15000
})

api.interceptors.request.use(config => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      clearToken()
      window.location.href = "/login"
    }

    if (err.response?.status === 403) {
      console.error("BLOCKED BY SECURITY:", err.response.data)
      //window.location.href = "/security-blocked"
    }

    return Promise.reject(err)
  }
)

export default api
