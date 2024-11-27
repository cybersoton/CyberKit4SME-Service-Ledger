import { HCV } from '../../../types'
import {
  getHashiCorpVaultUrl,
  rejectPromise,
  resolveData,
} from '../../../utils'

export async function encryptDataInGroup(
  token: string,
  group: string,
  data: object
) {
  const res = await fetch(
    `${getHashiCorpVaultUrl()}/transit/${group}/encrypt/stix`,
    {
      method: 'POST',
      headers: new Headers({
        'X-Vault-Token': token,
      }),
      body: JSON.stringify({
        plaintext: Buffer.from(JSON.stringify(data)).toString('base64'),
      }),
    }
  )

  const responseData = await res.json()

  if (!res.ok) {
    return rejectPromise(responseData)
  }

  return resolveData<HCV.Types.Secrets.EncryptedDataResponse>(responseData)
}

export async function decryptDataInGroup(
  token: string,
  group: string,
  data: string
) {
  const res = await fetch(
    `${getHashiCorpVaultUrl()}/transit/${group}/decrypt/stix`,
    {
      method: 'POST',
      headers: new Headers({
        'X-Vault-Token': token,
      }),
      body: JSON.stringify({
        ciphertext: data,
      }),
    }
  )

  const responseData = await res.json()

  if (!res.ok) {
    return rejectPromise(responseData)
  }

  return resolveData<HCV.Types.Secrets.DecryptedDataResponse>(responseData)
}

export async function createKeyInGroup(
  token: string,
  name: string,
  group: string,
  data: { type: string }
) {
  const res = await fetch(
    `${getHashiCorpVaultUrl()}/transit/${group}/keys/${name}`,
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
    message: `A pair (pk, sk) of cryptographic keys created to encrypt and decrypt ${name.toUpperCase()} objects`,
  })
}
