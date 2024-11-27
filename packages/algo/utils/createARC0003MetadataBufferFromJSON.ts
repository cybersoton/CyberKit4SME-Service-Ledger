import { createARC0003MetadataFromJSON } from './createARC0003MetadataFromJSON'

export const createARC0003MetadataBufferFromJSON = (
  json: object,
  dateTime: Date
) => {
  return Buffer.from(
    JSON.stringify(createARC0003MetadataFromJSON(json, dateTime))
  )
}
