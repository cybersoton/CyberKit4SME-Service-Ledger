export interface CreateEntityDataResponse {
  aliases: null
  id: string
  name: string
}

export interface GetEntityDataResponse {
  aliases: Array<string>
  creation_time: string
  direct_group_ids: Array<string>
  disabled: boolean
  group_ids: Array<string>
  id: string
  inherited_group_ids: Array<string>
  last_update_time: Date
  merged_entity_ids: object | null
  metadata: {[key: string]: string}
  name: string
  policies: Array<string>
}

export interface GetEntityIdDataResponse {
  bucket_key_hash: string
  creation_time: string
  disabled: boolean
  id: string
  last_update_time: Date
  metadata: {[key: string]: string}
  name: string
  aliases: Array<string>
  policies: Array<string>
}
