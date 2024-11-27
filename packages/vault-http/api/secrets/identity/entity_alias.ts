import { HCV } from '../../../types'
import {
  getHashiCorpVaultUrl,
  rejectPromise,
  resolveData,
} from '../../../utils'

export async function createEntityAlias(
  token: string,
  data: { name: string; canonical_id: string; mount_accessor: string }
) {
  const res = await fetch(`${getHashiCorpVaultUrl()}/identity/entity-alias`, {
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

  return resolveData<HCV.Types.Secrets.Identity.CreateEntityAliasDataResponse>(
    responseData
  )
}
