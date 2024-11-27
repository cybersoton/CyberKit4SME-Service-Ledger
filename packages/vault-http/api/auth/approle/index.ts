import { HCV } from '../../../types'
import {
  getHashiCorpVaultUrl,
  rejectPromise,
  resolveAuth,
} from '../../../utils'

export async function login() {
  const res = await fetch(`${getHashiCorpVaultUrl()}/auth/approle/login`, {
    method: 'POST',
    body: JSON.stringify({
      role_id: process.env.ROLE_ID,
      secret_id: process.env.ROLE_SECRET,
    }),
  })

  const responseData = await res.json()

  if (!res.ok) {
    return rejectPromise(responseData)
  }

  return resolveAuth<HCV.Types.Auth.LoginDataResponse>(responseData)
}
