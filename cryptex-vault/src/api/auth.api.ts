import api from "./axios"
import type { LoginResponse } from "../types/auth"

export const login = async (
  username: string,
  password: string
) => {
  const res = await api.post("api/auth/login", {
    username,
    password
  })

  console.log("RAW LOGIN RESPONSE DATA:", res.data)
  return res.data
}

export const register = async (
  username: string,
  password: string
): Promise<void> => {
  await api.post("api/auth/register", {
    username,
    password
  })
}
