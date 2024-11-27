export type fileObject = {
	path: 'object.json',
	content: Buffer
}

export type fileMetaData = {
	path: 'metadata.json',
	content: Buffer
}

export type STIXObjectPackage = {
	metadata: fileMetaData
	object: fileObject
}
