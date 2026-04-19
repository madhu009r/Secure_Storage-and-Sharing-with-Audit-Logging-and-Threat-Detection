import type { SecurityAlert } from "../types/alert"
import { riskLevel } from "../utils/format"
import { Badge } from "../components/Badge"

export default function AlertRow({ alert }: { alert: SecurityAlert }) {
  const level = riskLevel(alert.riskScore)

  const badgeType =
    level === "CRITICAL" ? "danger" :
    level === "HIGH" ? "warn" :
    "safe"

  return (
    <tr className="border-b border-vault-border">
      <td className="p-2">{alert.user}</td>
      <td className="p-2">
        <Badge label={level} type={badgeType} />
      </td>
      <td className="p-2">{alert.riskScore}</td>
      <td className="p-2">{alert.reason}</td>
      <td className="p-2 font-mono text-xs">{alert.ip}</td>
      <td className="p-2 text-xs">
        {new Date(alert.timestamp).toLocaleString()}
      </td>
    </tr>
  )
}
