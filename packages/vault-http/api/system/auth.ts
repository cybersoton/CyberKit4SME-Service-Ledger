import { HCV } from '../../types'
import { getHashiCorpVaultUrl, rejectPromise, resolveData } from '../../utils'

export async function listAuthMethods(token: string) {
  const res = await fetch(`${getHashiCorpVaultUrl()}/sys/auth`, {
    method: 'GET',
    headers: new Headers({
      'X-Vault-Token': token,
    }),
  })

  const responseData = await res.json()

  if (!res.ok) {
    return rejectPromise(responseData)
  }

  return resolveData<HCV.Types.System.AuthAccessorDataResponse>(responseData)
}

export async function getAuthAccessor(token: string, targetAuth: string) {
  try {
    const responseData = await listAuthMethods(token)

    return Promise.resolve(responseData[`${targetAuth}/`].accessor)
  } catch (error) {
    return Promise.reject(error)
  }
}
