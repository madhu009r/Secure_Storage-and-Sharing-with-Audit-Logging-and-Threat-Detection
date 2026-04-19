export default function ThreatBanner({
  riskScore,
  reason
}: {
  riskScore?: number
  reason?: string
}) {
  if (!riskScore) return null

  const level =
    riskScore > 80 ? "danger" :
    riskScore > 50 ? "warn" : "safe"

  return (
    <div className={`border-l-4 p-3 mb-4 ${
      level === "danger"
        ? "border-vault-danger bg-red-900/20"
        : level === "warn"
        ? "border-vault-warn bg-yellow-900/20"
        : "border-vault-safe bg-green-900/20"
    }`}>
      <div className="text-sm font-semibold">
        Threat Level: {riskScore}
      </div>
      <div className="text-xs opacity-80">
        {reason || "Behavior under observation"}
      </div>
    </div>
  )
}
