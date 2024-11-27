import debug from 'debug'

import crypto from 'crypto'

const log: debug.IDebugger = debug('sl-auth:crypto-utils')

export function generateAPIRootIdFromRequest(host: string, slug: string) {
  
  log(`Using params: ${host}, ${slug}`)

  return crypto.createHash('md5').update(`${host}${slug}`).digest('hex')
}
