import express from 'express'
import { RoutesConfig } from '../../config/routes'
import LoginController from '../../controllers/v1/login.controller'

export default class LoginRoute extends RoutesConfig {
  constructor(expressApp: express.Application) {
    super(expressApp, 'LoginRoutes')
  }

  configureRoutes() {

    this.expressApp.route('/v1/login').post(LoginController.login)

    return this.expressApp
  }
}
