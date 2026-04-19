export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-vault-panel border border-vault-border rounded-lg p-6 shadow-lg">
      {children}
    </div>
  )
}
