import { HCV } from '../../../types'
import {
  getHashiCorpVaultUrl,
  rejectPromise,
  resolveAuth,
} from '../../../utils'

export async function login(username: string, data: { password: string }) {
  const res = await fetch(
    `${getHashiCorpVaultUrl()}/auth/userpass/login/${username}`,
    {
      method: 'POST',
      body: JSON.stringify(data),
    }
  )

  const responseData = await res.json()  

  if (!res.ok) {
    return rejectPromise(responseData)
  }

  return resolveAuth<HCV.Types.Auth.LoginDataResponse>(responseData)
}

export async function createUserpass(
  token: string,
  user: string,
  data: { password: string; policies: Array<string>; token_policies: Array<string> }
) {
  const res = await fetch(
    `${getHashiCorpVaultUrl()}/auth/userpass/users/${user}`,
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

  return Promise.resolve({
    message: `UserPass Auth for: ${user} created successfully`,
  })
}

export async function deleteUserpass(token: string, user: string) {
  const res = await fetch(
    `${getHashiCorpVaultUrl()}/auth/userpass/users/${user}`,
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

  return Promise.resolve({
    message: `UserPass authentication revoked for user ${user}`,
  })
}
