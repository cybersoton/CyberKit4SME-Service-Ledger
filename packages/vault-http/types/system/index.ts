export interface AuthAccessorDataResponse {
  [auth: string]: {
    accessor: string
    config: [object]
    description: string
    external_entropy_access: boolean
    local: boolean
    options: object
    seal_wrap: boolean
    type: string
    uuid: string
  }
}
