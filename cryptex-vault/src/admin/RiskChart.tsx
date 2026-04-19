import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts"
import { SecurityAlert } from "../types/alert"

export default function RiskChart({ alerts }: { alerts: SecurityAlert[] }) {
  const data = alerts.map(a => ({
    time: new Date(a.timestamp).toLocaleTimeString(),
    risk: a.riskScore
  }))

  return (
    <LineChart width={600} height={250} data={data}>
      <XAxis dataKey="time" />
      <YAxis />
      <Tooltip />
      <Line dataKey="risk" strokeWidth={2} />
    </LineChart>
  )
}
