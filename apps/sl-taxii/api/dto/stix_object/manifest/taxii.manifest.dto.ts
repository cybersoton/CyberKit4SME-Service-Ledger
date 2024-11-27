import { STIXObject } from "@prisma/client";
import { stripNullAndEmptyProperties } from "../../../utils/json.utils";

type ManifestRecord = {
	id: string
	date_added: Date
	version: Date
	media_type?: string
}

type TAXIIManifest = {
	more?: boolean
	objects?: Array<ManifestRecord>
}

class TAXIIManifestDto {

	toTAXII = (
		stixObjects: Array<STIXObject>
	) => {
		const objects_metadata: Array<ManifestRecord> = []
		for (const object of stixObjects){
			objects_metadata.push({
				id: object.identifier,
				date_added: object.version,
				version: object.version,
				media_type: 'application/taxii+json;version=2.1',
			})
		}
		
		return stripNullAndEmptyProperties(
			<TAXIIManifest>{
				more: undefined,
				objects: objects_metadata
			})
	}

}

export default new TAXIIManifestDto()
