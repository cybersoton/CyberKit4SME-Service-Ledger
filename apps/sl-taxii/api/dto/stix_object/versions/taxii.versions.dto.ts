import { STIXObject } from "@prisma/client";
import { stripNullAndEmptyProperties } from "../../../utils/json.utils";

type TAXIIObjectVersions = {
	more?: boolean
	versions?: Array<Date>
}

class TAXIIObjectVersionsDto {

	toTAXII = (
		stixObjects: Array<STIXObject>
	) => {
		return stripNullAndEmptyProperties(
			<TAXIIObjectVersions>{
				more: undefined,
				versions: stixObjects.map(object => object.version)
			})
	}

}

export default new TAXIIObjectVersionsDto()
