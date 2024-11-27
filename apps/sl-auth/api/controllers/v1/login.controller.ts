import express from 'express'

import debug from 'debug'
import loginService from '../../services/v1/login.service'

const log: debug.IDebugger = debug('sl-auth:login-controller')

class LoginController {
  //   async loginAdmin(req: express.Request, res: express.Response) {
  //     loginService
  //       .loginAdmin(req.body)
  //       // .then(TAXIIDiscoveryDto.toDto)
  //       .then(admin => res.status(200).send(admin))
  //       .catch(err => {
  //         res.status(404).send({ err: err })
  //       })
  //   }

  async login(req: express.Request, res: express.Response) {
    loginService.loginEntity(req.body)
      .then(entity => res.status(200).send(entity))
      .catch(err => res.status(422).send({ error: err }))
  }
}

export default new LoginController()
