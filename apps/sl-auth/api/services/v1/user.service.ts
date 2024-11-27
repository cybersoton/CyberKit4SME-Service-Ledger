import debug from 'debug'
import { HashiCorpVaultIdentityService } from 'vault-service-sl'

const log: debug.IDebugger = debug('sl-auth:user.service')

class UserService {
  async create(token: string, organisation: string, body: any) {
    try {
      const { username, password } = body
      
      const loggedInService = HashiCorpVaultIdentityService.setToken(token)

      const org_role = "user"
      const entity = await loggedInService.createEntityInGroup(
        username,
        password,
        organisation,
        org_role
      )

      return Promise.resolve({ entity })
    } catch (err) {
      return Promise.reject(err)
    }
  }
}

export default new UserService()
