import debug from 'debug';

//import express from 'express';
import crypto from 'crypto';

const log: debug.IDebugger = debug('sl-taxii:crypto-utils');

export function generateAPIRootIdFromRequest(host: string, slug: string) {
	/*
	let host;
	if (overrideHost)
		host = 'localhost:6011'
	else
		host = req.get('host')
	*/
	
	log(`Using params: ${host}, ${slug}`);

	return crypto.createHash('md5').update(`${host}${slug}`).digest('hex');
}
