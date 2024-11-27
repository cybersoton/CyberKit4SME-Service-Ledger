import { PutCollectionDto } from "./put.collection.dto";

export interface CreateCollectionDto extends PutCollectionDto {
	id: string
	alias: string
	apiRootId: string
}
