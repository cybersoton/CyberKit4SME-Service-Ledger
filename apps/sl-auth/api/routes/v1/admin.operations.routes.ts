import express from 'express'
import { RoutesConfig } from '../../config/routes'
import AdminController from '../../controllers/v1/admin.controller'
import authMiddleware from '../../middleware/auth.middleware'

export default class AdminOpsRoutes extends RoutesConfig {
  constructor(expressApp: express.Application) {
    super(expressApp, 'AdminOpsRoutes')
  }

  configureRoutes() {
    
    this.expressApp.route('/v1/:organisation/algo_account')
    	.all(authMiddleware.authorizeToken)
    	.get(AdminController.getAlgoAccount)
    	
    this.expressApp.route('/v1/:organisation/users')
    	.all(authMiddleware.authorizeToken)
    	.get(AdminController.getUsersList)
    	
    this.expressApp.route('/v1/:organisation/users/:username')
    	.all(authMiddleware.authorizeToken)
    	.delete(AdminController.deleteUser)

    return this.expressApp
  }
}
