const KEY = "cryptex.jwt"

export const setToken = (token: string) =>
  sessionStorage.setItem(KEY, token)

export const getToken = () =>
  sessionStorage.getItem(KEY)

export const clearToken = () =>
  sessionStorage.removeItem(KEY)
