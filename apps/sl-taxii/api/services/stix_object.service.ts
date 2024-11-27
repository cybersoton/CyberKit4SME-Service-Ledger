import debug from 'debug'
import express from 'express'
import { spawn, Thread, Worker } from 'threads'
import { CRUD } from '../../db/interfaces/crud.interface'
import { STIXObjectPrismaDao, StatusPrismaDao } from '../../db/dao'
import { CreateSTIXObjectDto } from '../../db/dto/stix_object/create.stix_object.dto'
import collectionService from './collection.service'
import { validate as uuidValidate } from 'uuid'
import { TAXIIHeader } from '../utils/taxii-header.utils'
import { TAXIIQuery } from '../utils/taxii-query.utils'
import { ProcessQuery } from '../utils/taxii-query.utils'
import { StatusDetail, STIXObject } from '@prisma/client'
import { Status } from 'prisma-sl'
import { TransactionPackage } from '../types'
import { StatusJob } from '../threads/status/status.thread'
import { ipfsClient } from 'ipfs'
import { algodClient, indexerClient, Types, Utils } from 'algo'
import { HashiCorpVaultSecretsService } from 'vault-service-sl'
import statusService from './status.service'

const log: debug.IDebugger = debug('sl-taxii:stix_object.service')

class STIXObjectService implements CRUD {
  private stixObjectDao: typeof STIXObjectPrismaDao

  constructor() {
    this.stixObjectDao = STIXObjectPrismaDao
  }

  async create(resource: CreateSTIXObjectDto) {
    const stix_object = await this.stixObjectDao.addSTIXObject(resource)
    
    if (!stix_object) {
      log('Request rejected')
      return Promise.reject(
        'The API Root or Collection ID are not found, or the client can not write to this objects resource'
      )
    }

    return Promise.resolve(stix_object)
  }

  /**
   * @deprecated The method should not be used
   */
  async deleteById(id: string) {
    return Promise.reject('Illegal Operation')
  }

  /**
   * @deprecated The method should not be used
   */
  async list(limit: number, page: number) {
    return Promise.reject('Not Implemented')
  }

  /**
   * @deprecated The method should not be used
   */
  async patchById(id: string, resource: any) {
    return Promise.reject('Illegal Operation')
  }

  /**
   * @deprecated The method should not be used
   */
  async putById(id: string, resource: any) {
    return Promise.reject('Illegal Operation')
  }

  /**
   * @deprecated The method should not be used
   */
  async readById(id: string) {
    return Promise.reject('Not Implemented')
  }

  private async normalizeCollectionIdentifier(collectionParam: string, apiRootId: string) {
    let collectionId = collectionParam
    if (!uuidValidate(collectionParam)) {
      collectionId = await collectionService.getCollectionIdFromAlias(apiRootId, collectionParam)
    }
    return collectionId
  }
  
  async listVersionsByIdentifier(token: string, apiRoot: string, apiRootId: string, collectionParam: string, objectId: string, query: TAXIIQuery, res: express.Response) {
    if (Object.keys(query).length !== 0) {
      if (query.match) {
        log('Request rejected')
        return Promise.reject('The query parameter match is not allowed for this URL')
      }
    }
    
    const collectionId = await this.normalizeCollectionIdentifier(collectionParam, apiRootId)
    
    let stixObjects = await this.stixObjectDao.getSTIXObjectsFromCollectionByIdentifier(collectionId, objectId)
    
    if (stixObjects && Object.keys(query).length !== 0) {
        stixObjects = ProcessQuery.filterSTIXObjects(stixObjects, query)
    }

    if (!stixObjects || stixObjects.length === 0) {
      log('Request rejected')
      return Promise.reject('The API Root, Collection ID and/or Object ID are not found, or the client does not have access to the versions resource')
    }
    
    TAXIIHeader.attachResponseHeaders(stixObjects, res)

    return Promise.resolve(stixObjects)
  }
  
  async listObjectsManifest(token: string, apiRoot: string, apiRootId: string, collectionParam: string, query: TAXIIQuery, res: express.Response) {  
    const collectionId = await this.normalizeCollectionIdentifier(collectionParam, apiRootId)
    
    let stixObjects = await this.stixObjectDao.getSTIXObjects(collectionId)
    
    if (stixObjects && Object.keys(query).length !== 0) {
        stixObjects = ProcessQuery.filterSTIXObjects(stixObjects, query)
    }

    if (!stixObjects || stixObjects.length === 0) {
      log('Request rejected')
      return Promise.reject('The API Root, Collection ID and/or Object ID are not found, or the client does not have access to the manifest resource')
    }
    
    TAXIIHeader.attachResponseHeaders(stixObjects, res)

    return Promise.resolve(stixObjects)
  }

  async listObjectsByIdentifier(token: string, apiRoot: string, apiRootId: string, collectionParam: string, objectId: string, query: TAXIIQuery, res: express.Response) {
    if (Object.keys(query).length !== 0) {
      if (query.match?.id || query.match?.type) {
        log('Request rejected')
        return Promise.reject('The query parameters match[id] and match[type] are not allowed for this URL')
      }
    }
    
    const collectionId = await this.normalizeCollectionIdentifier(collectionParam, apiRootId)

    let stixObjects

    //query['version' as keyof object]
    
    if (Object.keys(query).length !== 0 && query.match?.version && !(Array.isArray(query.match?.version)) && query.match?.version.length > 5) {
      stixObjects = await this.stixObjectDao.getSTIXObjectsFromCollectionByIdentifierWithParams(collectionId, objectId, new Date(query.match.version! as string))
    } else {
      stixObjects = await this.stixObjectDao.getSTIXObjectsFromCollectionByIdentifier(collectionId, objectId)
    }
        
    if (stixObjects && Object.keys(query).length !== 0) {
        stixObjects = ProcessQuery.filterSTIXObjects(stixObjects, query)
    }
        
    if (!stixObjects || stixObjects.length === 0) {
      log('Request rejected')
      return Promise.reject('The API Root, Collection ID and/or Object ID are not found, or the client does not have access to the object resource')
    }
    
    TAXIIHeader.attachResponseHeaders(stixObjects, res)

    return this.decentralizedLookup(token, apiRoot, stixObjects)
  }

  async listObjects(token: string, apiRoot: string, apiRootId: string, collectionParam: string, query: TAXIIQuery, res: express.Response) {   
    const collectionId = await this.normalizeCollectionIdentifier(collectionParam, apiRootId)

    let stixObjects = await this.stixObjectDao.getSTIXObjects(collectionId)
    
    if (stixObjects && Object.keys(query).length !== 0) {
        stixObjects = ProcessQuery.filterSTIXObjects(stixObjects, query)
    }
    
    if (!stixObjects || stixObjects.length === 0) {
      log('Request rejected')
      return Promise.reject('The API Root or Collection ID are not found, or the client does not have access to the objects resource')
    }
    
    TAXIIHeader.attachResponseHeaders(stixObjects, res)

    return this.decentralizedLookup(token, apiRoot, stixObjects)
  }

  private async decentralizedLookup(token: string, apiRoot: string, stixObjects: Array<STIXObject>) {
    const publicAddressAssetMap = stixObjects.map(stixObject => {
      return {
        public_address: stixObject.public_address,
        assetId: stixObject.assetId,
      }
    })

    const paramsArray: Array<Record<string, unknown>> = []

    for await (const publicAddressAsset of publicAddressAssetMap) {
      paramsArray.push(
        await algodClient.searchPublicAddressForAsset(
          publicAddressAsset.public_address,
          publicAddressAsset.assetId
        )
      )
    }

    type IPFSMetadataBundle = {
      metadataARC0003: Types.MetadataARC0003
      ipfUrl: string
    }

    const jsonMetadataBundleArray: Array<IPFSMetadataBundle> = []

    for await (const params of paramsArray) {
      const ipfsUrl = Utils.normalizeARC0003IPSUrl(params['url'] as string)

      const metadataARC0003 = await ipfsClient.catStreamJSON(ipfsUrl)

      jsonMetadataBundleArray.push({
        metadataARC0003: metadataARC0003,
        ipfUrl: ipfsUrl.replace('/metadata.json', ''),
      })
    }

    const stixObjectDecryptedArray: Array<object> = []

    for await (const jsonMetadataBundle of jsonMetadataBundleArray) {
      const relative_path_url =
        jsonMetadataBundle.metadataARC0003.properties.relative_path_url

      const stixObjectEncrypted = JSON.parse(
        await ipfsClient.catStreamString(
          `${jsonMetadataBundle.ipfUrl}/${relative_path_url}`
        )
      )

      const loggedInService = HashiCorpVaultSecretsService.setToken(token)

      const base64Result = await loggedInService.decryptData(
        apiRoot,
        stixObjectEncrypted['ciphertext'] as string
      )
      
      stixObjectDecryptedArray.push(
        JSON.parse(
          Buffer.from(base64Result.plaintext, 'base64').toString('utf8')
        )
      )
    }

    return stixObjectDecryptedArray
  }

  async createIpfsAlgorand(token: string, apiRoot: string, apiRootId: string, collectionParam: string, reqBody: Record<string, Array<object>>) {
    const now = new Date()
    //.toISOString()

    const collectionId = await this.normalizeCollectionIdentifier(collectionParam, apiRootId)

    const pendingObjects = reqBody.objects

    const transactionPackages: Array<TransactionPackage> = []

    const loggedInService = HashiCorpVaultSecretsService.setToken(token)

    const [pub, sk] = await Promise.all([
      loggedInService.readSecrets(`${apiRoot}/algo-pub`),
      loggedInService.readSecrets(`${apiRoot}/algo-sk`),
    ])

    const public_address = Buffer.from(
      pub.data['public_address' as keyof object],
      'base64'
    ).toString()

    const privateKey = Buffer.from(
      sk.data['private_key' as keyof object] as string,
      'base64'
    )

    for (const stixObject of pendingObjects) {
      transactionPackages.push({
        identifier: stixObject['id' as keyof object],
        type: stixObject['type' as keyof object],
        version: now,
        data: await loggedInService.encryptData(apiRoot, stixObject),
        collectionId: collectionId,
        public_address: public_address,
        privateKey: Uint8Array.from(privateKey),
      })
    }
    
    /*
    * Differently from TAXII standard, in SL the version field must be the date when STIX object is added.
    * This because, relying on blockchain, SL does not allow data modifications
    *
    version:
          stixObject['modified' as keyof object] ||
          stixObject['created' as keyof object] ||
          now,
    */

    const status = await statusService.create({
      total_count: transactionPackages.length,
      apiRootId: apiRootId,
      StatusDetail: {
        createMany: {
          data: transactionPackages.map(transactionPackage => {
            return <StatusDetail>{
              identifier: transactionPackage.identifier,
              version: transactionPackage.version,
            }
          }),
        },
      },
    })

    for (let index = 0; index < status.StatusDetail.length; index++) {
      const statusDetail = status.StatusDetail[index]
      transactionPackages[index].id = statusDetail.id
    }
    
    const threads: Array<object> = []
    
    for (const transactionPackage of transactionPackages) {
      const statusWorker = await spawn<StatusJob>(
        new Worker('../threads/status/status.thread')
      )
      //const thread = await statusWorker.run(transactionPackage)
      threads.push(statusWorker.run(transactionPackage))
    }
    
    const stix_objects = await Promise.all(threads)
    
    const finalStatus = await statusService.update(status.apiRootId, status.id)

    return finalStatus
  }
}

export default new STIXObjectService()
