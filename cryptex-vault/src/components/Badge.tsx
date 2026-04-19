export function Badge({
  label,
  type
}: {
  label: string
  type: "safe" | "warn" | "danger"
}) {
  const colors = {
    safe: "bg-vault-safe",
    warn: "bg-vault-warn",
    danger: "bg-vault-danger"
  }

  return (
    <span className={`px-2 py-1 rounded text-xs ${colors[type]}`}>
      {label}
    </span>
  )
}
