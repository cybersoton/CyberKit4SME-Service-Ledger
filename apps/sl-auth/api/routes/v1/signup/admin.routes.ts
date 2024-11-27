import express from 'express'
import { RoutesConfig } from '../../../config/routes'
import AdminController from '../../../controllers/v1/admin.controller'
import authMiddleware from '../../../middleware/auth.middleware'

export default class AdminRoute extends RoutesConfig {
  constructor(expressApp: express.Application) {
    super(expressApp, 'AdminRoutes')
  }

  configureRoutes() {

    this.expressApp.route('/v1/signup/admin').post(AdminController.registerAdmin)
    
    return this.expressApp
  }
}
