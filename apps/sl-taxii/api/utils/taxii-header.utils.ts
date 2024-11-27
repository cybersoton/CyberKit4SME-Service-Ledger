import express from 'express'
import { STIXObject } from '@prisma/client'

export class TAXIIHeader {

	static attachResponseHeaders(stix_objects: Array<STIXObject>, res: express.Response) {
		  
		  const first = stix_objects[0].version
		  const last = stix_objects[stix_objects.length-1].version
		  
		  res.set({
		  	'X-TAXII-Date-Added-First': `${first}`,
		  	'X-TAXII-Date-Added-Last': `${last}`
		  })
	}

}
