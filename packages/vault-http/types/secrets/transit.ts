export interface EncryptedDataResponse {
  ciphertext: string
  key_version: number
}

export interface DecryptedDataResponse {
  plaintext: string
}
