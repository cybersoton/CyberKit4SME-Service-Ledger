import express from 'express'
import debug from 'debug'
import { sessionClient } from 'redis-session'

const log: debug.IDebugger = debug('sl-taxii:auth-middleware')

class AuthMiddleWare {
  async authorizeToken(req: express.Request, res: express.Response, next: express.NextFunction) {
    
    let authorised = false

    const authHeader = req.headers.authorization
    const apiroot = req.params.apiRoot
    //let path = ''
    let name, organisation, role, groups, token

    if (authHeader) {
      const sessionToken = authHeader?.split(' ')[1]
      
      const sessionEntity = await sessionClient.fetchSession(sessionToken)
      
      name = sessionEntity.name
      if (!name) {
        res.status(401).send({ error: 'Invalid authentication token'})
        return
      }
      organisation = sessionEntity.organisation
      role = sessionEntity.role
      groups = sessionEntity.groups
      token = sessionEntity.token

      if (groups?.includes(apiroot)) {
        
        if (req.method === "POST") {
          switch (req.originalUrl) {
            case `/${apiroot}`:
              if (role === "admin") authorised = true
              break
            case `/${apiroot}/collections`:
              if (role === "admin") authorised = true
              break
            case `/${apiroot}/collections/${req.params.collectionId}/objects`:
              authorised = true
              break
            case `/${apiroot}/collections/${req.params.collectionId}/objects/`:
              authorised = true
              break
          }
        } else {
          // method === GET
          authorised = true
        }
      }
      
    } else {
      res.status(401).send({ error: 'The client needs to authenticate'})
      return
    }
    
    if (authorised) {
      req.params.token = token
      next()
    } else {
      res.status(403).send({ error: `The client does not have access to this resource`})
      return
    }
  }
}

export default new AuthMiddleWare()
