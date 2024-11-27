import express from 'express'
import { RoutesConfig } from '../../config/routes'
import CollectionController from '../../controllers/collection.controller'
import authMiddleware from '../../middleware/auth.middleware'
import cryptoMiddleware from '../../middleware/crypto.middleware'

export default class CollectionRoute extends RoutesConfig {
  constructor(expressApp: express.Application) {
    super(expressApp, 'CollectionRoutes')
  }

  configureRoutes() {
    this.expressApp
      .route('/:apiRoot/collections')
      .all(authMiddleware.authorizeToken, cryptoMiddleware.hashAPIRouteRequest)
      .get(CollectionController.listCollections)
      .post(CollectionController.createCollection)

    this.expressApp
      .route('/:apiRoot/collections/:collectionId')
      .all(authMiddleware.authorizeToken, cryptoMiddleware.hashAPIRouteRequest)
      .get(CollectionController.getCollectionById)

    return this.expressApp
  }
}
