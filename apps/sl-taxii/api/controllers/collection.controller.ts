import express from 'express'
import debug from 'debug'
import collectionService from '../services/collection.service'
import TAXIICollectionDto from '../dto/collection/taxii.collection.dto'
import TAXIICollectionsDto from '../dto/collection/taxii.collections.dto'

const log: debug.IDebugger = debug('sl-taxii:collection-controller')

class CollectionController {
	async listCollections(req: express.Request, res: express.Response) {
		collectionService.listByAPIRootId(req.params.apiRootId)
			.then(TAXIICollectionsDto.toTAXII)
			.then(collections => res.status(200).send({ collections }))
			.catch(err => res.status(404).send({ error: err }))
	}
	
	async createCollection(req: express.Request, res: express.Response) {
		collectionService.create(req.body, req.params.apiRootId)
			.then(collection => res.status(200).send(collection))
			.catch(err => res.status(404).send({ error: err }))
	}

	async getCollectionById(req: express.Request, res: express.Response) {
		collectionService.readCollection(req.params.apiRootId, req.params.collectionId)
			.then(TAXIICollectionDto.toTAXII)
			.then(collection => res.status(200).send(collection))
			.catch(err => res.status(404).send({ error: err }))
	}
}

export default new CollectionController()
