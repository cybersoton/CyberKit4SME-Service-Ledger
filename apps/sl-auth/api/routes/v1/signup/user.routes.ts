import express from 'express'
import { RoutesConfig } from '../../../config/routes'
import authMiddleware from '../../../middleware/auth.middleware'
import UserController from '../../../controllers/v1/user.controller'

export default class UserRoute extends RoutesConfig {
  constructor(expressApp: express.Application) {
    super(expressApp, 'UserRoutes')
  }

  configureRoutes() {

    this.expressApp.route('/v1/signup/:organisation/user')
    	.all(authMiddleware.authorizeToken)
    	.post(UserController.createUser)

    return this.expressApp
  }
}
