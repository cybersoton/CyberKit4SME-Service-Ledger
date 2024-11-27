import express from 'express'

import debug from 'debug'
import userService from '../../services/v1/user.service'

const log: debug.IDebugger = debug('sl-auth:user-controller')

class UserController {

  async createUser(req: express.Request, res: express.Response) {
    userService
      .create(req.params.token, req.params.organisation, req.body)
      .then(user => res.status(200).send(user))
      .catch(err => res.status(422).send({ error: err }))
  }
}

export default new UserController()
