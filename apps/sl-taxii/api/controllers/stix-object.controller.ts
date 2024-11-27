import express from 'express'
import debug from 'debug'
import stixObjectService from '../services/stix_object.service'
import taxiiEnvelopeDto from '../dto/envelope/taxii.envelope.dto'
import taxiiManifestDto from '../dto/stix_object/manifest/taxii.manifest.dto'
import taxiiVersionsDto from '../dto/stix_object/versions/taxii.versions.dto'
import taxiiStatusDto from '../dto/status/taxii.status.dto'

const log: debug.IDebugger = debug('sl-taxii:object-controller')

class STIXObjectController {
  async listSTIXObjects(req: express.Request, res: express.Response) {
    stixObjectService.listObjects(req.params.token, req.params.apiRoot, req.params.apiRootId, req.params.collectionId, req.query, res)
      .then(taxiiEnvelopeDto.toTAXII)
      .then(stixObjects => res.status(200).send(stixObjects))
      .catch(err => res.status(404).send({ error: err }))
      //log({ error: err })
  }
  
  async listSTIXObjectsManifest(req: express.Request, res: express.Response) {
    stixObjectService.listObjectsManifest(req.params.token, req.params.apiRoot, req.params.apiRootId, req.params.collectionId, req.query, res)
      .then(taxiiManifestDto.toTAXII)
      .then(stixObjects => res.status(200).send(stixObjects))
      .catch(err => res.status(404).send({ error: err }))
  }

  async listSTIXObjectsByIdentifier(req: express.Request, res: express.Response) {
    stixObjectService.listObjectsByIdentifier(req.params.token, req.params.apiRoot, req.params.apiRootId, req.params.collectionId, req.params.objectId, req.query, res)
      .then(taxiiEnvelopeDto.toTAXII)
      .then(stixObject => res.status(200).send(stixObject))
      .catch(err => res.status(404).send({ error: err }))
  }

  async createSTIXObjects(req: express.Request, res: express.Response) {
    stixObjectService.createIpfsAlgorand(req.params.token, req.params.apiRoot, req.params.apiRootId, req.params.collectionId, req.body)
      .then(taxiiStatusDto.toTAXII)
      .then(stixObject => res.status(202).send(stixObject))
      .catch(err => res.status(404).send({ error: err }))
  }

  async listSTIXObjectVersions(req: express.Request, res: express.Response) {
    stixObjectService.listVersionsByIdentifier(req.params.token, req.params.apiRoot, req.params.apiRootId, req.params.collectionId, req.params.objectId, req.query, res)
      .then(taxiiVersionsDto.toTAXII)
      .then(stixObject => res.status(200).send(stixObject))
      .catch(err => res.status(404).send({ error: err }))
  }

}

export default new STIXObjectController()
