import debug from 'debug'
import { CreateSTIXObjectDto } from '../dto/stix_object/create.stix_object.dto'

import { STIXObject } from 'prisma-sl'

const log: debug.IDebugger = debug('sl-taxii:api_root.prisma.dao')

class STIXObjectPrismaDao {
  async addSTIXObject(stixObjectCreationFields: CreateSTIXObjectDto) {
    return STIXObject.create({
      data: {
        ...stixObjectCreationFields,
      },
    })  
  }

  async getSTIXObjectsByIdentifier(stixObjectIdentifier: string) {
    return STIXObject.findMany({
      where: {
        identifier: stixObjectIdentifier,
      },
    })
  }

  async getSTIXObjectsFromCollectionByIdentifier(
    collectionId: string,
    stixObjectIdentifier: string
  ) {
    return STIXObject.findMany({
      where: {
        collectionId: collectionId,
        identifier: stixObjectIdentifier,
      },
    })
  }

  async getSTIXObjectsFromCollectionByIdentifierWithParams(
    collectionId: string,
    stixObjectIdentifier: string,
    version: Date
  ) {
    return STIXObject.findMany({
      where: {
        collectionId: collectionId,
        identifier: stixObjectIdentifier,
        version: version,
      },
    })
  }

  async getSTIXObjects(collectionId: string) {
    return STIXObject.findMany({
      where: {
        collectionId: collectionId,
      },
    })
  }
}

export default new STIXObjectPrismaDao()
