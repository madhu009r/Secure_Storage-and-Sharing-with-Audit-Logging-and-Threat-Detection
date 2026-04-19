import Card from "../components/Card"

export default function AccountLocked() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card>
        <h2 className="text-lg font-semibold text-vault-danger mb-2">
          Account Temporarily Locked
        </h2>
        <p className="text-sm opacity-80">
          Suspicious activity was detected on your account.
          Access will be automatically restored after the security window expires.
        </p>
      </Card>
    </div>
  )
}
