export interface PutCollectionDto {
	title: string
	description?: string
	media_types: Array<string>
	can_read: boolean
	can_write: boolean
}
