import debug from 'debug'
import { Prisma } from 'prisma-sl'
import { CreateCollectionDto } from '../../db/dto/collection/create.collection.dto'
import { PatchCollectionDto } from '../../db/dto/collection/patch.collection.dto'
import { CRUD } from '../../db/interfaces/crud.interface'
import { CollectionPrismaDao } from '../../db/dao'
import { validate as uuidValidate } from 'uuid'

const log: debug.IDebugger = debug('sl-taxii:collection-service')

class CollectionService implements CRUD {
  private collectionDao: typeof CollectionPrismaDao

  constructor() {
    this.collectionDao = CollectionPrismaDao
  }

  async create(resource: CreateCollectionDto, digest?: string) {
    try {
      const slug = resource.alias.replace(/ /g, "_").replace(/\W/g, "").toLowerCase()
      resource.alias = slug
      resource.apiRootId = digest!
      resource.media_types = ["application/taxii+json;version=2.1"]
      resource.can_read = true
      resource.can_write = true
      
      const collection = await this.collectionDao.addCollection(resource)
      return Promise.resolve({ collection })
      
    } catch (e) {
      return Promise.reject(decodeError(e))
    }
  }

  async patchById(id: string, resource: PatchCollectionDto) {
    try {
      const collection = await this.collectionDao.updateCollection(id, resource)
      return Promise.resolve({ collection })
    } catch (e) {
      return Promise.reject(decodeError(e))
    }
  }

  async listByAPIRootId(apiRootId: string) {
    try {
      const collections = await this.collectionDao.getCollectionsByAPIRootId(apiRootId)
      return Promise.resolve(collections)
    } catch (e) {
      return Promise.reject(decodeError(e))
    }
  }

  async readCollection(apiRootId: string, collectionParam: string) {
    let collection = undefined
    if (uuidValidate(collectionParam)) {
      collection = await this.collectionDao.getCollectionById(apiRootId, collectionParam)
    } else {
      collection = await this.collectionDao.getCollectionByAlias(apiRootId, collectionParam)
    }

    if (collection) return Promise.resolve(collection)

    log('Request rejected')
    return Promise.reject(
      'The API Root or Collection ID are not found, or the client does not have access to the collection resource'
    )
  }
  
  async getCollectionIdFromAlias(apiRootId: string, alias: string) {
    const collection = await this.collectionDao.getCollectionByAlias(apiRootId, alias)

    if (!collection) {
      log('Request rejected')
      return Promise.reject(
        'The API Root or Collection ID are not found, or the client does not have access to the collection resource'
      )
    }

    return Promise.resolve(collection.id)
  }

  /*
  async readByAPIRootAndCollectionId(apiRootId: string, collectionId: string) {
    const collection = await this.collectionDao.getCollectionById(
      apiRootId,
      collectionId
    )

    if (!collection) {
      log('rejected')
      return Promise.reject(
        'The Collection service is not found, or the client does not have access to the resource'
      )
    }

    return Promise.resolve(collection)
  }

  async readByAPIRootAndAlias(apiRootId: string, alias: string) {
    const collection = await this.collectionDao.getCollectionByAlias(
      apiRootId,
      alias
    )

    if (!collection) {
      log('rejected')
      return Promise.reject(
        'The Collection service is not found, or the client does not have access to the resource'
      )
    }

    return Promise.resolve(collection)
  }
  */
  
  /**
   * @deprecated The method should not be used
   */
  async readById(id: string) {
    return Promise.reject('Not Implemented')
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
  async putById(id: string, resource: any) {
    return Promise.reject('Illegal Operation')
  }
}

export default new CollectionService()

function decodeError(e: unknown) {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    console.log('is KnownPrismaError')

    // The .code property can be accessed in a type-safe manner
    if (e.code === 'P2002') {
      return e.message
    }
  }

  if (e instanceof Prisma.PrismaClientUnknownRequestError) {
    console.log('is UnknownPrismaError')
  }

  if (e instanceof Prisma.PrismaClientRustPanicError) {
    console.log('is PrismaClientRustPanicError')
  }

  if (e instanceof Prisma.PrismaClientValidationError) {
    console.log('is PrismaClientValidationError')
    console.log(e.message)

    return e.message
  }

  log(e)

  return e
}
