import { Collection } from '@prisma/client';
import { stripNullAndEmptyProperties } from "../../utils/json.utils";

type TAXIIcollection = {
	id: string;
	title: string;
	description?: string;
	alias?: string;
	can_read: boolean;
	can_write: boolean;
	media_types?: string[];
}

class TAXIICollectionDto {

	toTAXII = (
		collection: Collection
	) => {
		return stripNullAndEmptyProperties(
			<TAXIIcollection>{
				id: collection.id,
				title: collection.title,
				description: collection.description,
				alias: collection.alias,
				can_read: collection.can_read,
				can_write: collection.can_write,
				media_types: collection.media_types
			}
		)
	}

}

export default new TAXIICollectionDto()

