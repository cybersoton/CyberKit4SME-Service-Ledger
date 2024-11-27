import express from 'express'
import { RoutesConfig } from '../../config/routes'
import STIXObjectController from '../../controllers/stix-object.controller'
import authMiddleware from '../../middleware/auth.middleware'
import cryptoMiddleware from '../../middleware/crypto.middleware'
import stixMiddleware from '../../middleware/stix.middleware'

export default class STIXObjectRoute extends RoutesConfig {
  constructor(expressApp: express.Application) {
    super(expressApp, 'STIXObjectRoutes')
  }

  configureRoutes() {
    this.expressApp
      .route('/:apiRoot/collections/:collectionId/objects')
      .all(authMiddleware.authorizeToken, stixMiddleware.validateBodyFields, stixMiddleware.validateQuery, cryptoMiddleware.hashAPIRouteRequest)
      .get(STIXObjectController.listSTIXObjects)
      .post(STIXObjectController.createSTIXObjects)
      
    this.expressApp
      .route('/:apiRoot/collections/:collectionId/manifest')
      .all(authMiddleware.authorizeToken, stixMiddleware.validateQuery, cryptoMiddleware.hashAPIRouteRequest)
      .get(STIXObjectController.listSTIXObjectsManifest)

    this.expressApp
      .route('/:apiRoot/collections/:collectionId/objects/:objectId')
      .all(authMiddleware.authorizeToken, stixMiddleware.validateQuery, cryptoMiddleware.hashAPIRouteRequest)
      .get(STIXObjectController.listSTIXObjectsByIdentifier)

    this.expressApp
      .route('/:apiRoot/collections/:collectionId/objects/:objectId/versions')
      .all(authMiddleware.authorizeToken, stixMiddleware.validateQuery, cryptoMiddleware.hashAPIRouteRequest)
      .get(STIXObjectController.listSTIXObjectVersions)

    return this.expressApp
  }
}
