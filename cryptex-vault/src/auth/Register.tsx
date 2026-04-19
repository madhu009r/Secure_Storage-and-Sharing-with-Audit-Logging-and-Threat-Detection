import { useState } from "react"
import  { register } from "../api/auth.api"
import Card from "../components/Card"
import Button from "../components/Button"

export default function Register() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [done, setDone] = useState(false)

  const handleRegister = async () => {
    await register(username, password)
    setDone(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card>
        <h1 className="text-xl font-semibold mb-4">
          Identity Enrollment
        </h1>

        {done ? (
          <p className="text-sm text-vault-safe">
            Registration complete. You may authenticate.
          </p>
        ) : (
          <>
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

            <Button onClick={handleRegister}>
              Create Secure Identity
            </Button>
          </>
        )}
      </Card>
    </div>
  )
}
