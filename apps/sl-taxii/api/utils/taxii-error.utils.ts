import debug from 'debug';

const log: debug.IDebugger = debug('sl-taxii:taxii-error-utils');

abstract class TAXIIError extends Error {

	title: string;
	description?: string;
	error_id?: string;
	error_code?: string;
	http_status?: number;
	external_details?: string;
	details?: object;

	constructor(
		title: string,
		description?: string,
		error_id?: string,
		error_code?: string,
		http_status?: number,
		external_details?: string,
		details?: object,
	) {
		super();
		this.title = title;
		this.description = description;
		this.error_id = error_id;
		this.error_code = error_code;
		this.http_status = http_status;
		this.external_details = external_details;
		this.details = details;
	}
}

export class NotFoundError extends TAXIIError {
	constructor(description: string, details?: Record<string, unknown>) {
		super(
			'Resource not found',
			description,
			undefined,
			undefined,
			404,
			undefined,
			details,
		);
	}
}

export class BadRequestError extends TAXIIError {
	constructor() {
		super(
			'Bad request',
			'The server did not understand the request',
			undefined,
			undefined,
			400,
			undefined,
			undefined,
		);
	}
}
export class BadFilteringParams extends TAXIIError {
	constructor(description: string, detailsArray: Record<string, unknown>[]) {

		const details: Record<string, unknown> = {};

		log(detailsArray)

		detailsArray.forEach((detail) => {
			log(`detail : ${detail}`)
			details[Object.keys(detail)[0]] = Object.values(detail)[0]
			log(`details : ${details}`)
		})

		super(
			'Bad request',
			description,
			undefined,
			undefined,
			400,
			undefined,
			details,
		);
	}
}

export class UnsupportedMediaType extends TAXIIError {
	constructor(detailsArray: Record<string, unknown>[]) {

		const details: Record<string, unknown> = {};

		log(detailsArray)

		detailsArray.forEach((detail) => {
			log(`detail : ${detail}`)
			details[Object.keys(detail)[0]] = Object.values(detail)[0]
			log(`details : ${details}`)
		})

		super(
			'Unsupported Media Type',
			'The client attempted to POST a payload with a content type the server does not support',
			undefined,
			undefined,
			415,
			undefined,
			details,
		);
	}
}