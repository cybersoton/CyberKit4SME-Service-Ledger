import { StatusDetail } from "@prisma/client"
import { stripNullAndEmptyProperties } from "../../../utils/json.utils"

export type TAXIIStatusDetail = {
	id: string
	version: Date
	message?: string
}

class TAXIIStatusDetailDto {
	toTAXII = (
		statusDetail: StatusDetail
	) => {
		return <TAXIIStatusDetail>{
			id: statusDetail.identifier,
			version: statusDetail.version,
			message: statusDetail.message
		}
	}
}
export default new TAXIIStatusDetailDto()
