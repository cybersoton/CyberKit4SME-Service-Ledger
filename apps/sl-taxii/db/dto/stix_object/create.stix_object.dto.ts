export interface CreateSTIXObjectDto {
	identifier: string
	type: string
	version: Date
	spec_version: string
	public_address: string
	assetId: number
	collectionId: string
}