import { secrets } from 'vault-http'
import { HashiCorpVaultLoginService } from './login'

class HashiCorpVaultSecretsService extends HashiCorpVaultLoginService {
  async encryptData(groupName: string, data: object) {
    return secrets.transit.encryptDataInGroup(this.token, groupName, data)
  }

  async decryptData(groupName: string, data: string) {
    return secrets.transit.decryptDataInGroup(this.token, groupName, data)
  }
  
  async getEntityInfo(username: string) {
    return secrets.identity.entity.readEntityByName(this.token, username)
  }

  async getUserGroups(username: string) {
    const { group_ids } = await secrets.identity.entity.readEntityByName(
      this.token,
      username
    )

    const pReadGroupById = group_ids.map(group_id =>
      secrets.identity.group.readGroupById(this.token, group_id)
    )

    const results = await Promise.all(pReadGroupById)

    return results.map(result => result.name)
  }

  async readSecrets(path: string) {
    return secrets.secret.readSecret(this.token, path)
  }

  setToken(token: string) {
    this.token = token
    return this
  }
}

export default new HashiCorpVaultSecretsService()
