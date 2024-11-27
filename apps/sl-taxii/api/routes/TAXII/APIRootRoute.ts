import express from 'express'
import { RoutesConfig } from '../../config/routes'
import apiRootController from '../../controllers/api-root.controller'
import authMiddleware from '../../middleware/auth.middleware'
import cryptoMiddleware from '../../middleware/crypto.middleware'

export default class APIRootRoute extends RoutesConfig {
  constructor(expressApp: express.Application) {
    super(expressApp, 'APIRootRoutes')
  }

  configureRoutes() {
    this.expressApp
      .route('/:apiRoot')
      .all(authMiddleware.authorizeToken, cryptoMiddleware.hashAPIRouteRequest)
      .get(apiRootController.getAPIRootById)
      .post(apiRootController.createAPIRoot)

    return this.expressApp
  }
}
