export default function Button({
  children,
  danger,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { danger?: boolean }) {
  return (
    <button
      {...props}
      className={`px-4 py-2 rounded font-medium transition
        ${danger
          ? "bg-vault-danger hover:bg-red-500"
          : "bg-vault-accent hover:bg-blue-500"}
      `}
    >
      {children}
    </button>
  )
}
