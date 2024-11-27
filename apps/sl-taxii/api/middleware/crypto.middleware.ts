import express from 'express'
import debug from 'debug'
import { generateAPIRootIdFromRequest } from '../utils/crypto.utils'

const log: debug.IDebugger = debug('sl-taxii:crypto-middleware')

class CryptoMiddleware {
  async hashAPIRouteRequest(req: express.Request, res: express.Response, next: express.NextFunction) {
    
    const hostname = req.hostname
    const port = '6023'
    const domain = `https://${hostname}:${port}`
    const slug = req.params.apiRoot
    
    if (slug) {
      req.params.apiRootId = generateAPIRootIdFromRequest(domain, slug)
      log(`Using domain-apiroot digest: ${req.params.apiRootId}`)
      next()
    } else {
      res.status(404).send({
        error: 'The required path "/{apiroot}" is missing in the requested URL endpoint',
      })
    }
  }
}

export default new CryptoMiddleware()
