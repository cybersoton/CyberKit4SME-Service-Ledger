import { HCV } from '../../../types'
import {
  getHashiCorpVaultUrl,
  rejectPromise,
  resolveData,
} from '../../../utils'

export async function createSecret(token: string, path: string, data: object) {
  const res = await fetch(`${getHashiCorpVaultUrl()}/secret/data/${path}`, {
    method: 'POST',
    headers: new Headers({
      'X-Vault-Token': token,
    }),
    body: JSON.stringify({ data }),
  })
  
  const responseData = await res.json()

  if (!res.ok) {
    return rejectPromise(responseData)
  }

  return resolveData<HCV.Types.Secrets.CreateSecretDataResponse>(responseData)
}

export async function readSecretSubkeys(token: string, path: string) {
  const res = await fetch(`${getHashiCorpVaultUrl()}/secret/subkeys/${path}`, {
    method: 'GET',
    headers: new Headers({
      'X-Vault-Token': token,
    }),
  })

  const responseData = await res.json()

  if (!res.ok) {
    return rejectPromise(responseData)
  }

  return Promise.resolve(responseData)
}

export async function readSecret(token: string, path: string) {
  const res = await fetch(`${getHashiCorpVaultUrl()}/secret/data/${path}`, {
    method: 'GET',
    headers: new Headers({
      'X-Vault-Token': token,
    }),
  })

  const responseData = await res.json()

  if (!res.ok) {
    return rejectPromise(responseData)
  }

  return resolveData<HCV.Types.Secrets.ReadSecretDataResponse>(responseData)
}
