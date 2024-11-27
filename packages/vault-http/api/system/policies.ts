import { getHashiCorpVaultUrl, rejectPromise } from '../../utils'

export async function createACLPolicy(
  token: string,
  groupName: string,
  data: { policy: string }
) {
  const res = await fetch(
    `${getHashiCorpVaultUrl()}/sys/policy/${groupName}`,
    {
      method: 'POST',
      headers: new Headers({
        'X-Vault-Token': token,
      }),
      body: JSON.stringify(data),
    }
  )

  if (!res.ok) {
    const responseData = await res.json()
    return rejectPromise(responseData)
  }

  return Promise.resolve({ message: `Policy ${groupName} created` })
}
