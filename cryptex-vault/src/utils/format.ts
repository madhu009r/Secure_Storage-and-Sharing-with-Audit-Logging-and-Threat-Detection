export const riskLevel = (score: number) => {
  if (score >= 80) return "CRITICAL"
  if (score >= 50) return "HIGH"
  if (score >= 30) return "MEDIUM"
  return "LOW"
}
