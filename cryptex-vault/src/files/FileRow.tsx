import type { FileMeta } from "../types/file"
import { Badge } from "../components/Badge"
import Button from "../components/Button"
import { downloadFile, shareFile } from "../api/files.api"

export default function FileRow({ file }: { file: FileMeta }) {
  const download = async () => {
    const blob = await downloadFile(file.id)
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = file.filename
    a.click()
  }

  const share = async () => {
    const token = await shareFile(file.id)
    alert(`Share token: ${token}`)
  }

  return (
    <div className="flex justify-between items-center border-b border-vault-border py-2">
      <div>
        <div className="font-medium">{file.filename}</div>
        <div className="text-xs opacity-70">
          {new Date(file.uploadedAt).toLocaleString()}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Badge
          label={file.blockchainStatus}
          type={
            file.blockchainStatus === "VERIFIED"
              ? "safe"
              : file.blockchainStatus === "PENDING"
              ? "warn"
              : "danger"
          }
        />
        <Button onClick={download}>Download</Button>
        <Button onClick={share}>Share</Button>
      </div>
    </div>
  )
}
