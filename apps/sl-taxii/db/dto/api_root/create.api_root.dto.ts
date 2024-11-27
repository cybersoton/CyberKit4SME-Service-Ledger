import { PutAPIRootDto } from "./put.api_root.dto";

export interface CreateAPIRootDto extends PutAPIRootDto {
	id: string
	versions: string[]
	max_content_length: number
	domain: string
	slug: string
	discoveryId: string
}
