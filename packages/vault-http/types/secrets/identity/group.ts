export interface CreatedGroupDataResponse {
  id: string
  name: string
}

export interface ReadGroupDataResponse {
  alias: object
  creation_time: string
  id: string
  last_update_time: Date
  member_entity_ids: Array<string>
  member_group_ids: Array<string> | null
  metadata: object
  modify_index: number
  name: string
  parent_group_ids: Array<string> | null
  policies: Array<String>
  type: string
}
