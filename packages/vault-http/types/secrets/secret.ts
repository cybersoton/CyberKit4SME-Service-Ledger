export interface CreateSecretDataResponse {
  created_time: Date
  custom_metadata: object
  deletion_time: Date
  destroyed: boolean
  version: number
}

export interface ReadSecretDataResponse {
  data: object
  metadata: object
}
