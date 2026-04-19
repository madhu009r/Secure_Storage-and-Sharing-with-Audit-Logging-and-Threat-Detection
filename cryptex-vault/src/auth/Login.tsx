import { useState } from "react"
import { login } from "../api/auth.api"
import { setToken } from "../utils/token"
import Card from "../components/Card"
import Button from "../components/Button"
import ThreatBanner from "../security/ThreatBanner"

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [risk, setRisk] = useState<number | undefined>()
  const [reason, setReason] = useState<string | undefined>()

  const handleLogin = async () => {
    console.log("LOGIN BUTTON CLICKED")
  try {
    const res = await login(username, password)
    console.log("LOGIN RES IN COMPONENT:", res)

    if (res.block) {
      window.location.href = "/security-blocked"
      return
    }

    setToken(res.token)
    sessionStorage.setItem("role", res.role)
    window.location.href = "/"
  } catch {
    setError("Invalid username or password")
  }
}

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card>
        <h1 className="text-xl font-semibold mb-4">
          Secure Access
        </h1>

        <ThreatBanner riskScore={risk} reason={reason} />

        <input
          className="w-full mb-2 p-2 rounded bg-black/20 border border-vault-border"
          placeholder="username"
          onChange={e => setUsername(e.target.value)}
        />

        <input
          type="password"
          className="w-full mb-4 p-2 rounded bg-black/20 border border-vault-border"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />

        {error && (
          <div className="text-xs text-vault-danger mb-2">
            {error}
          </div>
        )}

        <Button type="button" onClick={handleLogin}>
          Authenticate
        </Button>
      </Card>
    </div>
  )
}
