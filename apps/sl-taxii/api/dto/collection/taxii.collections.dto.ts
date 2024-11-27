import { Collection } from '@prisma/client';
import TAXIICollectionDto from './taxii.collection.dto';

class TAXIICollectionsDto {

	toTAXII = (
		collections: Array<Collection>
	) => {
		return collections.map(TAXIICollectionDto.toTAXII);
	}

}

export default new TAXIICollectionsDto()

