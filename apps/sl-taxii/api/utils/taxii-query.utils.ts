import { STIXObject } from '@prisma/client'

export type TAXIIQuery = {
	added_after?: string;
	limit?: string;
	match?: {
		id?: string | Array<string>;
		type?: string | Array<string>;
		version?: string | Array<string>;
	};
}

export class ProcessQuery {

	static filterSTIXObjects(stix_objects: Array<STIXObject>, query: TAXIIQuery) {
		if (query.added_after) {
			const date = new Date(query.added_after)
			stix_objects = stix_objects.filter(obj => obj.version > date)
			if (stix_objects.length === 0) return stix_objects
		}
		if (query.match) {
			if (query.match.id) {
				if (Array.isArray(query.match.id)) {
					const idArray = query.match.id as Array<string>
					stix_objects = stix_objects.filter(obj => idArray.includes(obj.identifier))
				} else {
					const id = query.match.id as string
					stix_objects = stix_objects.filter(obj => obj.identifier === id)
				}
				if (stix_objects.length === 0) return stix_objects
			}
			if (query.match.type) {
				if (Array.isArray(query.match.type)) {
					const typeArray = query.match.type as Array<string>
					stix_objects = stix_objects.filter(obj => typeArray.includes(obj.type))
				} else {
					const type = query.match.type as string
					stix_objects = stix_objects.filter(obj => obj.type === type)
				}
				if (stix_objects.length === 0) return stix_objects
			}
			if (query.match.version) {
				if (Array.isArray(query.match.version)) {
					const version = query.match.version as Array<string>
					const positions = version.filter(item => (item === 'first' || item === 'last'))
					const timestamps = version.filter(item => (item !== 'first' && item !== 'last'))
					if (timestamps.length !== 0) {
						stix_objects = stix_objects.filter(obj => timestamps.includes(obj.version.toISOString()))
					}
					if (stix_objects.length === 0) return stix_objects
					if (positions.length !== 0){
						if (positions.length === 2) {
							// Both first and last but stix_objects.length is 1, then get just first
							if (positions.length > stix_objects.length) {
								stix_objects = stix_objects.slice(0, 1)
							} else {
								const first = stix_objects.slice(0, 1)
								const last = stix_objects.slice(-1)
								stix_objects = first.concat(last)
							}
						} else {
							// One between first and last
							if (positions[0] === 'first') stix_objects = stix_objects.slice(0, 1)
							else stix_objects = stix_objects.slice(-1)
						}
					}
				} else {
					const version = query.match.version as string
					switch (version) {
						case 'first':
							stix_objects = stix_objects.slice(0, 1)
							break
						case 'last':
							stix_objects = stix_objects.slice(-1)
							break
						default:
							stix_objects = stix_objects.filter(obj => obj.version.toISOString() === version)
							break
					}
				}
			}
		}
		if (query.limit) {
			const limit = parseInt(query.limit)  
			if (limit < stix_objects.length) stix_objects = stix_objects.slice(0, limit)
		}
		
		return stix_objects
	}

}
