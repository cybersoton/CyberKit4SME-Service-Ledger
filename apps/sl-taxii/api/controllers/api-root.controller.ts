import express from 'express';
import debug from 'debug';
import apiRootService from '../services/api_root.service'
import TAXIIAPIRootDto from '../dto/api_root/taxii.api_root.dto';
import { NotFoundError } from '../utils/taxii-error.utils';

const log: debug.IDebugger = debug('sl-taxii:api-root-controller');

class APIRootController {
	async getAPIRootById(req: express.Request, res: express.Response) {
		apiRootService.readById(req.params.apiRootId)
			.then(TAXIIAPIRootDto.toTAXII)
			.then(apiRoot => res.status(200).send(apiRoot))
			.catch(err => res.status(404).send(new NotFoundError(err)));
	}
	
	async createAPIRoot(req: express.Request, res: express.Response) {
    		apiRootService.create(req.body, req.hostname, req.params.apiRoot, req.params.apiRootId)
			.then(apiroot => res.status(200).send(apiroot))
			.catch(err => res.status(404).send({ error: err }))
	}

	async patchAPIRoot(req: express.Request, res: express.Response) {
		apiRootService.patchById(req.params.id, req.body)
			.then(apiroot => res.status(200).send(apiroot))
			.catch(err => res.status(422).send({ error: err }))}
	}

export default new APIRootController();
