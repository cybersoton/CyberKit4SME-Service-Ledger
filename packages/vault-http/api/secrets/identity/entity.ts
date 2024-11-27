import { HCV } from '../../../types'
import {
  getHashiCorpVaultUrl,
  rejectPromise,
  resolveData,
} from '../../../utils'

export async function createEntity(
  token: string,
  data: { name: string; policies: Array<string>; metadata: {[key: string]: string} }
) {
  const res = await fetch(`${getHashiCorpVaultUrl()}/identity/entity`, {
    method: 'POST',
    headers: new Headers({
      'X-Vault-Token': token,
    }),
    body: JSON.stringify(data),
  })

  const responseData = await res.json()

  if (!res.ok) {
    return rejectPromise(rejectPromise)
  }

  return resolveData<HCV.Types.Secrets.Identity.CreateEntityDataResponse>(
    responseData
  )
}

export async function readEntityByName(token: string, name: string) {
  const res = await fetch(
    `${getHashiCorpVaultUrl()}/identity/entity/name/${name}`,
    {
      method: 'GET',
      headers: new Headers({
        'X-Vault-Token': token,
      }),
    }
  )

  const responseData = await res.json()

  if (!res.ok) {
    return rejectPromise(rejectPromise)
  }

  return resolveData<HCV.Types.Secrets.Identity.GetEntityDataResponse>(
    responseData
  )
}

export async function readEntityById(token: string, id: string) {
  const res = await fetch(
    `${getHashiCorpVaultUrl()}/identity/entity/id/${id}`,
    {
      method: 'GET',
      headers: new Headers({
        'X-Vault-Token': token,
      }),
    }
  )

  const responseData = await res.json()

  if (!res.ok) {
    return rejectPromise(rejectPromise)
  }

  return resolveData<HCV.Types.Secrets.Identity.GetEntityIdDataResponse>(
    responseData
  )
}

export async function deleteEntityByName(token: string, name: string) {
  const res = await fetch(
    `${getHashiCorpVaultUrl()}/identity/entity/name/${name}`,
    {
      method: 'DELETE',
      headers: new Headers({
        'X-Vault-Token': token,
      }),
    }
  )

  if (!res.ok) {
    const responseData = await res.json()
    return rejectPromise(responseData)
  }

  return Promise.resolve( { message: `Entity ${name} deleted successfully` } )
}
