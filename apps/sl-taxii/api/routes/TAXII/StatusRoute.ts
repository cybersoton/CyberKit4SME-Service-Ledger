import express from 'express'
import { RoutesConfig } from '../../config/routes'

import StatusController from '../../controllers/status.controller'
import authMiddleware from '../../middleware/auth.middleware'
import cryptoMiddleware from '../../middleware/crypto.middleware'

export default class StatusRoute extends RoutesConfig {
  constructor(expressApp: express.Application) {
    super(expressApp, 'StatusRoutes')
  }

  configureRoutes() {
    this.expressApp
      .route('/:apiRoot/status/:statusId')
      .all(authMiddleware.authorizeToken, cryptoMiddleware.hashAPIRouteRequest)
      .get(StatusController.getStatusById)

    return this.expressApp
  }
}
