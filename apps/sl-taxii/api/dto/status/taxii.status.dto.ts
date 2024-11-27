import { Status, StatusDetail, StatusStatus, STIXObject } from "@prisma/client";
import { stripNullAndEmptyProperties } from "../../utils/json.utils";
import taxiiStatusDetailDto, { TAXIIStatusDetail } from "./status_detail/taxii.status_detail.dto";

type TAXIIStatus = {
	id: string
	status: StatusStatus
	request_timestamp?: Date
	total_count: number
	success_count: number
	successes?: Array<TAXIIStatusDetail>
	failure_count: number
	failures?: Array<TAXIIStatusDetail>
	pending_count: number
	pendings?: Array<TAXIIStatusDetail>
}

class TAXIIStatusDto {

	toTAXII = (
		status: Status & { StatusDetail: StatusDetail[] }
	) => {

		const successes: Array<TAXIIStatusDetail> = []
		const failures: Array<TAXIIStatusDetail> = []
		const pendings: Array<TAXIIStatusDetail> = []

		for (const statusDetail of status.StatusDetail) {
			switch (statusDetail.statusDetailStatus) {
				case "success":
					successes.push(
						taxiiStatusDetailDto.toTAXII(statusDetail)
					)
					break
				case "failure":
					failures.push(
						taxiiStatusDetailDto.toTAXII(statusDetail)
					)
					break
				case "pending":
					pendings.push(
						taxiiStatusDetailDto.toTAXII(statusDetail)
					)
					break
				default:
					break
			}
		}

		return stripNullAndEmptyProperties(
			<TAXIIStatus>{
				id: status.id,
				status: status.status,
				request_timestamp: status.request_timestamp,
				total_count: status.total_count,
				success_count: successes.length,
				successes: successes,
				failure_count: failures.length,
				failures: failures,
				pending_count: pendings.length,
				pendings: pendings
			}
		)
	}

}

export default new TAXIIStatusDto()
