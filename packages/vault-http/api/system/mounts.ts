import { getHashiCorpVaultUrl, rejectPromise } from '../../utils'

export async function enableSecretsEngine(
  token: string,
  path: string,
  data: { type: string }
) {
  const res = await fetch(`${getHashiCorpVaultUrl()}/sys/mounts/${path}`, {
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
    message: `Secret Engine of ${data.type.toUpperCase()} enabled at Path: ${path}`,
  })
}
