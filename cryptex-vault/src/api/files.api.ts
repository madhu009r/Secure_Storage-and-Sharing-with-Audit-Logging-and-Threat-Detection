import api from "./axios"
import type { FileMeta } from "../types/file"

export const uploadFile = async (
  file: File,
  onProgress: (p: number) => void
) => {
  const formData = new FormData()
  formData.append("file", file)

  await api.post("/api/files/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: e => {
      const percent = Math.round((e.loaded * 100) / (e.total || 1))
      onProgress(percent)
    }
  })
}

export const fetchMyFiles = async (): Promise<FileMeta[]> => {
  const res = await api.get("/api/files/my")
  return res.data
}

export const downloadFile = async (id: number) => {
  const res = await api.get(`/api/files/download/${id}`, {
    responseType: "blob"
  })
  return res.data
}

export const shareFile = async (id: number) => {
  const res = await api.post("/api/files/share", { fileId: id })
  return res.data.token
}
