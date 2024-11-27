import debug from 'debug'
import { sessionClient, Session } from 'redis-session'

import {
  HashiCorpVaultLoginService,
  HashiCorpVaultSecretsService,
} from 'vault-service-sl'

const log: debug.IDebugger = debug('sl-auth:login.service')

class LoginService {
  async loginEntity(body: any) {
    try {
      const { username, password } = body

      const { token } = await HashiCorpVaultLoginService.loginUserPass(
        username,
        password
      )
      
      const loggedInService = HashiCorpVaultSecretsService.setToken(token)

      const groups = await loggedInService.getUserGroups(username)
      
      const { name, id, metadata } = await loggedInService.getEntityInfo(username)
      
      const { organisation, role } = metadata
      //const organisation = metadata.organisation
      //const role = metadata.role

      const data = <Session>{
      	name: name,
      	organisation: organisation,
      	role: role,
      	groups: groups,
      	token: token
      }

      const sl_token = await sessionClient.createAndSaveSession(data)
      
      return Promise.resolve({ name, id, metadata, sl_token })
    } catch (err) {
      log(err)
      return Promise.reject(err)
    }
  }

}

export default new LoginService()
