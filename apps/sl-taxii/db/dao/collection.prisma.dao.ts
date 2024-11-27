import debug from 'debug'
import { CreateCollectionDto } from '../dto/collection/create.collection.dto'
import { PatchDiscoveryDto } from '../dto/discovery/patch.discovery.dto'

import { Collection } from 'prisma-sl'

const log: debug.IDebugger = debug('sl-taxii:discovery.prisma.dao')

class CollectionPrismaDao {
  async addCollection(collectionCreationFields: CreateCollectionDto) {
    return Collection.create({
          data: {
            ...collectionCreationFields,
          },
        })
  }

  async getCollectionsByAPIRootId(apiRootId: string) {
    return Collection.findMany({
      where: {
        apiRootId: apiRootId,
      },
    })
  }

  async getCollectionById(apiRootId: string, collectionId: string) {
    return Collection.findUnique({
      where: {
        id_apiRootId: {
          apiRootId: apiRootId,
          id: collectionId,
        },
      },
    })
  }

  async getCollectionByAlias(apiRootId: string, collectionAlias: string) {
    return Collection.findUnique({
      where: {
        alias_apiRootId: {
          alias: collectionAlias,
          apiRootId: apiRootId,
        },
      },
    })
  }

  async updateCollection(collectionId: string, collectionPatchFields: PatchDiscoveryDto) {
    return Collection.update({
      where: {
        id: collectionId,
      },
      data: {
        ...collectionPatchFields,
      },
    })
  }
  
  async deleteCollectionById(collectionId: string) {
    return Collection.delete({
      where: {
        id: collectionId,
      },
    })
  }
}

export default new CollectionPrismaDao()
