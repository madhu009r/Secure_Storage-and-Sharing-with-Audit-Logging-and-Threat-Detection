export interface FileMeta {
  id: number
  filename: string
  size: number
  uploadedAt: string
  blockchainStatus: "VERIFIED" | "PENDING" | "FAILED"
  txHash?: string
}
