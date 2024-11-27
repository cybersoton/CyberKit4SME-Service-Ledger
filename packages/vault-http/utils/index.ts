import HttpError from '../error'
import { HCV } from '../types'

const host = process.env.HCV_HOST || ''
const port = process.env.HCV_PORT || 0
const version = process.env.HCV_VERSION || ''

export function getHashiCorpVaultUrl() {
  return `http://${host}:${port}/${version}`
}

export function rejectPromise(responseData: any) {
  return Promise.reject(
    new HttpError(responseData as HCV.Types.HashiCorpVaultRequestError)
  )
}

export function resolveData<T>(responseData: any) {
  return Promise.resolve(
    (responseData as HCV.Types.HashiCorpVaultResponse).data as T
  )
}

export function resolveAuth<T>(responseData: any) {
  return Promise.resolve(
    (responseData as HCV.Types.HashiCorpVaultResponse).auth as T
  )
}
