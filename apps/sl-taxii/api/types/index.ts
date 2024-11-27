export type TransactionPackage = {
  id?: string
  identifier: string
  type: string
  version: Date
  data: object
  collectionId: string
  public_address: string
  privateKey: Uint8Array
}
