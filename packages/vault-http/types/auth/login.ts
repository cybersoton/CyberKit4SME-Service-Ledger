type LoginMetadata = {
  role_name: string
}

export type LoginDataResponse = {
  client_token: string
  accessor: string
  policies: Array<string>
  token_policies: Array<string>
  metadata: LoginMetadata
  lease_duration: number
  renewable: boolean
  entity_id: string
  token_type: string
  orphan: boolean
  mfa_requirement: unknown | null
  num_uses: number
}
