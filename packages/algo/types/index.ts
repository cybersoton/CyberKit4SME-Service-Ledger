export type AssetInfo = {
  'created-at-round': number
  deleted: boolean
  index: number
  params: Record<string, unknown>
}

export type AssetMetadata = {
  amount: number
  'asset-id': number
  deleted: boolean
  'is-frozen': boolean
  'opted-in-at-round': number
}

export type MetadataARC0003Properties = {
  name: string
  description: string
  relative_path_url: string
  relative_url_integrity: string
}

export type MetadataARC0003 = {
  title: 'SLIX Token Metadata'
  type: 'object'
  properties: MetadataARC0003Properties
}

export type ParamsUrl = {
  cid: string
  path: string
}
