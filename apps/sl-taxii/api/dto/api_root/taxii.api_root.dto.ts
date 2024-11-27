import { APIRoot } from "@prisma/client";
import { stripNullAndEmptyProperties } from "../../utils/json.utils";

type TAXIIapiroot = {
	title: string;
	description?: string;
	versions: string[];
	max_content_length: number;
}

class TAXIIAPIRootDto {

	toTAXII = (
		apiroot: APIRoot
	) => {
		return stripNullAndEmptyProperties(
			<TAXIIapiroot>{
				title: apiroot.title,
				description: apiroot.description,
				versions: apiroot.versions,
				max_content_length: apiroot.max_content_length
			}
		)
	}

}

export default new TAXIIAPIRootDto()

