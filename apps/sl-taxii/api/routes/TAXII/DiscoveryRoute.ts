import express from 'express';
import { RoutesConfig } from '../../config/routes';

import DiscoveryController from '../../controllers/discovery.controller';

export default class DiscoveryRoute extends RoutesConfig {
	constructor(expressApp: express.Application) {
		super(expressApp, 'DiscoveryRoutes');
	}

	configureRoutes() {
		this.expressApp.route('/taxii2')
			.get(DiscoveryController.getDiscovery);

		return this.expressApp;
	}
}
