import debug from 'debug';

const log: debug.IDebugger = debug('sl-taxii:crypto-utils');

export function countRows(objectJson: Record<string, unknown>) {
	return Object.keys(objectJson).length;
}

export function countKeys(objectJson: Record<string, unknown>) {
	return Object.keys(objectJson).length;
}

export function stripNullAndEmptyProperties(objectJson: Record<string, unknown>) {

	Object.keys(objectJson).forEach(key => {
		const val = objectJson[key]
		if ((!Number.isInteger(val) && !val) || (Array.isArray(val) && val.length < 1)) {
			delete objectJson[key]
		}
	})

	return objectJson
}