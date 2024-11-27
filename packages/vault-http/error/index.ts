import { HashiCorpVaultRequestError } from '../types/http'

export default class HttpError extends Error {
  errors: Array<string>

  constructor(errors: HashiCorpVaultRequestError) {
    super(errors.errors.toString())
    this.errors = errors.errors
  }
}
