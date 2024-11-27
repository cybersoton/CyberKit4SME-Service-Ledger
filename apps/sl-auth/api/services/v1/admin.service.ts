import debug from 'debug'
import { HashiCorpVaultIdentityService, HashiCorpVaultSecretsService } from 'vault-service-sl'

const log: debug.IDebugger = debug('sl-auth:admin.service')

class AdminService {
  
  async create(body: any, algorand_account_mnemonic?: string) {
    try {
      const { org_name, username, password } = body
      
      if (org_name === "taxii2" || org_name === "v1") throw new Error('Invalid name for the organisation')
      const org = org_name.replace(/ /g, "_").replace(/\W/g, "").toLowerCase()

      const loggedInService = await HashiCorpVaultIdentityService.loginAppRole()
      
      const organisation = await loggedInService.createGroup(
        org,
        algorand_account_mnemonic
      )
      
      const org_role = "admin"
      const entity = await loggedInService.createEntityInGroup(
        username,
        password,
        org,
        org_role
      )

      return Promise.resolve({ organisation, entity })
    } catch (err) {
      return Promise.reject(err)
    }
  }
  
  async getAlgorandAddress(token: string, org: string) {
    try {
      const loggedInService = HashiCorpVaultSecretsService.setToken(token)
      
      const account = await loggedInService.readSecrets(`${org}/algo-pub`)
      
      const address = Buffer.from(account.data['public_address' as keyof object], 'base64').toString()
      
      const algorand = {"account_address": address}

      return Promise.resolve({ algorand })
    } catch (err) {
      return Promise.reject(err)
    }
  }
  
  async getOrgUsers(token: string, org: string) {
    try {
      const loggedInService = HashiCorpVaultIdentityService.setToken(token)
      
      const users = await loggedInService.listGroupUsers(org)

      return Promise.resolve({ users })
    } catch (err) {
      return Promise.reject(err)
    }
  }
  
  async removeOrgUser(token: string, org: string, user: string) {
    try {
      const loggedInService = HashiCorpVaultIdentityService.setToken(token)
      
      const org_users = await loggedInService.listGroupUsers(org)
      
      if (!org_users.includes(user)) {
        log('Request rejected')
        return Promise.reject(`Removal request denied, entity ${user} does not belong to organisation ${org}`)
      }
      
      const mex = await loggedInService.deleteUser(org, user)

      return Promise.resolve(mex)
    } catch (err) {
      return Promise.reject(err)
    }
  }
}

export default new AdminService()
