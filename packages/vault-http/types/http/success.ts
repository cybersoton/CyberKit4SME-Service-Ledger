export interface HashiCorpVaultResponse {
  request_id: string
  lease_id: string
  renewable: boolean
  lease_duration: number
  data: any | null
  wrap_info: unknown | null
  warnings: unknown | null
  auth: any | null
}
