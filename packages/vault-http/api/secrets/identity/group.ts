import { HCV } from '../../../types'
import {
  getHashiCorpVaultUrl,
  rejectPromise,
  resolveData,
} from '../../../utils'

export async function createGroup(token: string, data: { name: string }) {
  const res = await fetch(`${getHashiCorpVaultUrl()}/identity/group`, {
    method: 'POST',
    headers: new Headers({
      'X-Vault-Token': token,
    }),
    body: JSON.stringify(data),
  })

  const responseData = await res.json()

  if (!res.ok) {
    return rejectPromise(responseData)
  }

  return resolveData<HCV.Types.Secrets.Identity.CreatedGroupDataResponse>(
    responseData
  )
}

export async function readGroupByName(token: string, name: string) {
  const res = await fetch(
    `${getHashiCorpVaultUrl()}/identity/group/name/${name}`,
    {
      method: 'GET',
      headers: new Headers({
        'X-Vault-Token': token,
      }),
    }
  )

  const responseData = await res.json()

  if (!res.ok) {
    return rejectPromise(responseData)
  }

  return resolveData<HCV.Types.Secrets.Identity.ReadGroupDataResponse>(
    responseData
  )
}

export async function readGroupById(token: string, id: string) {
  const res = await fetch(`${getHashiCorpVaultUrl()}/identity/group/id/${id}`, {
    method: 'GET',
    headers: new Headers({
      'X-Vault-Token': token,
    }),
  })

  const responseData = await res.json()

  if (!res.ok) {
    return rejectPromise(responseData)
  }

  return resolveData<HCV.Types.Secrets.Identity.ReadGroupDataResponse>(
    responseData
  )
}

export async function updateGroupById(
  token: string,
  id: string,
  data: { member_entity_ids?: Array<string>; policies?: Array<string> }
) {
  const res = await fetch(`${getHashiCorpVaultUrl()}/identity/group/id/${id}`, {
    method: 'POST',
    headers: new Headers({
      'X-Vault-Token': token,
    }),
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const responseData = await res.json()
    return rejectPromise(responseData)
  }

  return Promise.resolve({
    message: `Group with id: ${id} updated successfully`,
  })
}
