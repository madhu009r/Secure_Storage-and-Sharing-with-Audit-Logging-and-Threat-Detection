import { useEffect, useState } from "react"
import { fetchSecurityAlerts } from "../api/admin.api"
import type { SecurityAlert } from "../types/alert"
import AlertRow from "./AlertRow"
import Card from "../components/Card"

export default function Alerts() {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([])
  const [minRisk, setMinRisk] = useState(0)

  useEffect(() => {
    fetchSecurityAlerts().then(setAlerts)
  }, [])

  const filtered = alerts.filter(a => a.riskScore >= minRisk)

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-semibold">
            Security Alerts
          </h1>

          <select
            className="bg-black/30 border border-vault-border p-1 rounded text-sm"
            onChange={e => setMinRisk(Number(e.target.value))}
          >
            <option value={0}>All Risks</option>
            <option value={30}>≥ Medium</option>
            <option value={50}>≥ High</option>
            <option value={80}>≥ Critical</option>
          </select>
        </div>

        <table className="w-full text-sm">
          <thead className="text-left opacity-70">
            <tr>
              <th className="p-2">User</th>
              <th className="p-2">Severity</th>
              <th className="p-2">Score</th>
              <th className="p-2">Reason</th>
              <th className="p-2">IP</th>
              <th className="p-2">Time</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((a, i) => (
              <AlertRow key={i} alert={a} />
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
