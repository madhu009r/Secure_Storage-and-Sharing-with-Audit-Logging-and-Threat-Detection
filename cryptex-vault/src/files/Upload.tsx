import { useState } from "react"
import { uploadFile } from "../api/files.api"
import Card from "../components/Card"

export default function Upload({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("")

  const handleUpload = async (file: File) => {
    setStatus("Encrypting & uploading…")
    await uploadFile(file, setProgress)
    setStatus("Stored securely. Audit pending.")
    onDone()
  }

  return (
    <Card>
      <h2 className="font-semibold mb-2">Secure Upload</h2>

      <input
        type="file"
        title="Select a file to upload"
        onChange={e => e.target.files && handleUpload(e.target.files[0])}
      />

      {progress > 0 && (
        <div className="mt-2 text-xs">
          Upload Progress: {progress}%
        </div>
      )}

      {status && (
        <div className="mt-2 text-xs opacity-80">
          {status}
        </div>
      )}
    </Card>
  )
}
