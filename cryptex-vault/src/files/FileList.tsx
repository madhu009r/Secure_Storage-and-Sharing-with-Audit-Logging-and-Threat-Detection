import { useEffect, useState } from "react"
import { fetchMyFiles } from "../api/files.api"
import type { FileMeta } from "../types/file"
import Upload from "./Upload"
import FileRow from "./FileRow"

export default function FileList() {
  const [files, setFiles] = useState<FileMeta[]>([])

  const load = async () => {
    const data = await fetchMyFiles()
    setFiles(data)
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Upload onDone={load} />

      <div className="mt-6">
        {files.map(f => (
          <FileRow key={f.id} file={f} />
        ))}
      </div>
    </div>
  )
}
