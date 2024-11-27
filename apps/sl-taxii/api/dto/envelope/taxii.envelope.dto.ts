import { stripNullAndEmptyProperties } from "../../utils/json.utils";

type TAXIIEnvelope = {
	more?: boolean;
	next?: string;
	objects?: Array<object>
}

class TAXIIEnvelopeDto {

	toTAXII = (
		stixObjects: Array<object>
	) => {
		return stripNullAndEmptyProperties(
			<TAXIIEnvelope>{
				objects: stixObjects
			})
	}

}

export default new TAXIIEnvelopeDto()

