import { createHash } from 'crypto'
import { MetadataARC0003 } from '../types'

export const createARC0003MetadataFromJSON = (json: object, dateTime: Date) => {
  const expectedSTIXFile1Buffer = Buffer.from(JSON.stringify(json))
  const hash = `sha256-${createHash('sha256')
    .update(expectedSTIXFile1Buffer)
    .digest('base64')}`

  return <MetadataARC0003>{
    title: 'SLIX Token Metadata',
    type: 'object',
    properties: {
      name: json['id' as keyof object],
      description:
        json['modified' as keyof object] ||
        json['created' as keyof object] ||
        dateTime,
      relative_path_url: 'object.json',
      relative_url_integrity: hash,
    },
  }
}
