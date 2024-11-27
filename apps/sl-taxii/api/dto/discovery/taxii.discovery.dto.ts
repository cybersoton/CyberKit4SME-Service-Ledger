import { APIRoot, Discovery } from "@prisma/client";
import { stripNullAndEmptyProperties } from "../../utils/json.utils";

type TAXIIdiscovery = {
	title: string;
	description?: string;
	contact?: string;
	default?: string;
	api_roots?: string[]
}

class TAXIIDiscoveryDto {

	toTAXII = (
		discovery: Discovery & { APIRoot: APIRoot[] }
	) => {
		return stripNullAndEmptyProperties(
			<TAXIIdiscovery>{
				title: discovery.title,
				description: discovery.description,
				contact: discovery.contact,
				default: discovery.default,
				api_roots: discovery.APIRoot.map(
					apiRoot => {
						return `${apiRoot.domain}/${apiRoot.slug}/`
					}
				)
			}
		)

	}

}

export default new TAXIIDiscoveryDto()

