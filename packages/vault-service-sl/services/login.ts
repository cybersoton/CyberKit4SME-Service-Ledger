import { auth } from 'vault-http'

export class HashiCorpVaultLoginService {
  private _token: string

  constructor() {
    this._token = ''
  }

  async loginAppRole() {
    try {
      this._token = (await auth.appRole.login()).client_token
      return Promise.resolve(this)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async loginUserPass(username: string, password: string) {
    try {
      this._token = (
        await auth.userpass.login(username, { password: password })
      ).client_token
      return Promise.resolve(this)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  get token(): string {
    return this._token
  }

  set token(token: string) {
    this._token = token
  }
}

export default new HashiCorpVaultLoginService()
