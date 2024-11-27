import express from 'express'
import debug from 'debug'
import { sessionClient } from 'redis-session'

const log: debug.IDebugger = debug('sl-auth:auth-middleware')

class AuthMiddleWare {
  
  async authorizeToken(req: express.Request, res: express.Response, next: express.NextFunction) {
    
    let authorised = false

    const authHeader = req.headers.authorization
    const org = req.params.organisation
    let name, organisation, role, token

    if (authHeader) {
      const sessionToken = authHeader?.split(' ')[1]

      const sessionEntity = await sessionClient.fetchSession(sessionToken)
      //if (Object.keys(sessionEntity).length === 0)
      
      name = sessionEntity.name
      if (!name) {
        res.status(401).send({ error: 'Invalid authentication token'})
        return
      }
      organisation = sessionEntity.organisation
      role = sessionEntity.role
      token = sessionEntity.token

      if (organisation === org && role === 'admin') {
        log(`Entity "${name}" of organisation "${organisation}" with role "${role}" has been authorised`)
        req.params.token = token
        authorised = true
      } else {
        res.status(401).send({ error: `Entity <${name}> is not authorised because is not admin for organisation <${org}>`})
        return
      }
      
    } else {
      res.status(401).send({ error: `Authentication: Bearer token must be provided`})
      return
    }
    
    if (authorised) next()
  }
}

export default new AuthMiddleWare()
