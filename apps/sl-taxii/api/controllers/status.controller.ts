import express from 'express';
import debug from 'debug';
import statusService from '../services/status.service';
import taxiiStatusDto from '../dto/status/taxii.status.dto';

const log: debug.IDebugger = debug('sl-taxii:status-controller');

class StatusController {
	async getStatusById(req: express.Request, res: express.Response, next: express.NextFunction) {
		statusService.readById(req.params.apiRootId, req.params.statusId)
			.then(taxiiStatusDto.toTAXII)
			.then(status => res.status(200).send(status))
			.catch(err => res.status(404).send({ error: err }))
	}
}

export default new StatusController();
