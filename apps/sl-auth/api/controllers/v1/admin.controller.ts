import express from 'express'

import debug from 'debug'
import adminService from '../../services/v1/admin.service'

const log: debug.IDebugger = debug('sl-auth:admin-controller')

class AdminController {

  async registerAdmin(req: express.Request, res: express.Response) {
    adminService
      .create(req.body, req.body['algorand_account_mnemonic'] || undefined)
      .then(admin => res.status(200).send(admin))
      .catch(err => res.status(422).send({ error: err }))
  }
  
  async getAlgoAccount(req: express.Request, res: express.Response) {
    adminService
      .getAlgorandAddress(req.params.token, req.params.organisation)
      .then(address => res.status(200).send(address))
      .catch(err => res.status(422).send({ error: err }))
  }
  
  async getUsersList(req: express.Request, res: express.Response) {
    adminService
      .getOrgUsers(req.params.token, req.params.organisation)
      .then(users => res.status(200).send(users))
      .catch(err => res.status(422).send({ error: err }))
  }
  
  async deleteUser(req: express.Request, res: express.Response) {
    adminService
      .removeOrgUser(req.params.token, req.params.organisation, req.params.username)
      .then(message => res.status(200).send( { organisation: message }))
      .catch(err => res.status(422).send({ error: err }))
  }
}

export default new AdminController()
