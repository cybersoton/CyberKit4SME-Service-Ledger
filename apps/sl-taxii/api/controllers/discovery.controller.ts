import express from 'express';
import debug from 'debug';
import discoveryService from '../services/discovery.service';
import TAXIIDiscoveryDto from '../../api/dto/discovery/taxii.discovery.dto';
import { NotFoundError } from '../utils/taxii-error.utils';

const log: debug.IDebugger = debug('sl-taxii:discovery-controller');

class DiscoveryController {
	async getDiscovery(req: express.Request, res: express.Response) {
		discoveryService.readById('taxii2')
			.then(TAXIIDiscoveryDto.toTAXII)
			.then(discovery => res.status(200).send(discovery))
			.catch(err => res.status(404).send(new NotFoundError(err)));
	}
}

export default new DiscoveryController();
