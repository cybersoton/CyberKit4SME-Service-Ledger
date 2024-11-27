import express from 'express'
import debug from 'debug'
import moment from 'moment'

const log: debug.IDebugger = debug('sl-taxii:stix-middleware')

class STIXObjectMiddleWare {
  async validateBodyFields(req: express.Request, res: express.Response, next: express.NextFunction) {
    
    if (req.method === 'POST') {  
	if (Object.keys(req.body).length === 0) {
		res.status(400).send({ error: 'The data payload is missing'})
		return
	}
	if (Object.keys(req.query).length !== 0) {
		res.status(400).send({ error: 'Queries are not enabled on a POST request'})
		return
	}

	let content: number = 0
	const content_header = req.get('Content-Length')
	if (content_header) content = parseInt(content_header)

	if (content > 104857600) {
		res.status(413).send({ error: 'The POSTed payload exceeds the max_content_length of the API Root'})
	}
	else if (!req.body.objects) {
		res.status(422).send({ error: 'The object type or version is not supported or could not be processed. This can happen, for example, when sending a version of STIX that this TAXII Server does not support and cannot process, when sending a malformed body, or other unprocessable content'})
	}
	else {
		next()
	}

	/*
	* Not useful because of the reverse proxy
	*
	else if ( !(req.is('application/json') || req.is('application/taxii+json;version=2.1')) ) {
	res.status(415).send({ error: 'The client attempted to POST a payload with a content type the server does not support'})
	}
	*/
    } else {
    	next()
    }
    
  }
  
  async validateQuery(req: express.Request, res: express.Response, next: express.NextFunction) {
    
    if (Object.keys(req.query).length === 0) {
    	next()
    } else {
    	if (isQueryValid(req.query)) {
    		if (req.query['added_after' as keyof object]) {
    			if (!(isDateAfterValid(req.query['added_after' as keyof object] as string))) {
    				res.status(400).send({ error: 'The query parameter "added_after" is invalid, it must be a date in a valid format'})
				return
    			}
    		}
    		if (req.query['limit' as keyof object]) {
    			if (!(isLimitValid(req.query['limit' as keyof object] as string))) {
    				res.status(400).send({ error: 'The query parameter "limit" is invalid, it must be a positive integer greater than 0'})
				return
    			}
    		}
    		if (req.query['match' as keyof object]) {
    			const match_obj = req.query['match' as keyof object]!
    			if (match_obj['version' as keyof object]) {
    				const version = match_obj['version' as keyof object]! as string | Array<string>
	    			if (!(isVersionValid(version))) {
	    				res.status(400).send({ error: 'The query parameter "match[version]" is invalid. It can contain the keywords "first" and "last", or timestamps which must be provided in ISO 8610 format'})
					return
	    			}
	    		}
    		}
    		next()
    	} else {
    		res.status(400).send({ error: 'The query parameters used are not allowed. Please refer to the documentation.'})
		return
    	}
    }
    
  }
  
}

function isDateAfterValid(date: string): boolean {
	return moment(date).isValid()
}

function isLimitValid(limit: string): boolean {
	return !isNaN(parseInt(limit)) && parseInt(limit)>0
}

function hasDuplicates(array: Array<string>): boolean {
	return (new Set(array)).size !== array.length
}

function isQueryValid(query: object): boolean {
    	let valid = false
    
    	const query_keys: Array<string> = Object.keys(query)
    	log(query_keys)

    	let keys_validity: Array<boolean> = []
    	let match_keys: Array<string> = []
    	for (let i=0; i<query_keys.length; i++) {
		if (query_keys[i] === 'added_after' || query_keys[i] === 'limit' || query_keys[i] === 'match') {
			keys_validity.push(true)
			
			if (query_keys[i] === 'match') {
				const match_obj = query['match' as keyof object]!
				match_keys = Object.keys(match_obj)
	    			log(match_keys)
	    			
	    			for (let j=0; j<match_keys.length; j++) {
	    				if (match_keys[j] === 'id' || match_keys[j] === 'type' || match_keys[j] === 'version') keys_validity.push(true)
	    				else keys_validity.push(false)
	    			}
			}
		} else {
			keys_validity.push(false)
		}
    	}
    
    	if (query_keys.length <= 3 && match_keys.length <= 3 && keys_validity.every(key => key === true)) {
		valid = true
    	}
    
    	if (query['added_after' as keyof object]) {
    		if (Array.isArray(query['added_after' as keyof object])) valid = false
    	}
    
    	if (query['limit' as keyof object]) {
    		if (Array.isArray(query['limit' as keyof object])) valid = false
    	}
    
    	if (query['match' as keyof object]) {
	    	const match_obj = query['match' as keyof object]!
	    	
	    	if (match_obj['version' as keyof object]) {
	    		const version = match_obj['version' as keyof object]!
	    		if (Array.isArray(version)) {
	    			const versionArray = version as Array<string>
	    			if (hasDuplicates(versionArray)) valid = false
	    			//if (versionArray.includes('all')) valid = false
	    		}
	    	}
	}
    
	return valid
}

function isVersionValid(version: string | Array<string>): boolean {
    	let valid = false
    
    	if (Array.isArray(version)) {
	    	let versionA = version as Array<string>
	    	let value_validity: Array<boolean> = []
    	
	    	for (let i=0; i<versionA.length; i++) {
	    		
	    		if (versionA[i] === 'first' || versionA[i] === 'last' || moment(versionA[i], moment.ISO_8601, true).isValid()) {
	    			value_validity.push(true)
	    		} else {
	    			value_validity.push(false)
	    		}
	    	}
    	
    		if (value_validity.every(value => value === true)) valid = true
    	} else {
	    	let versionS = version as string
	    	
	    	if (versionS === 'first' || versionS === 'last' || moment(version, moment.ISO_8601, true).isValid()) valid = true
    	}
    
	return valid
}

export default new STIXObjectMiddleWare()
