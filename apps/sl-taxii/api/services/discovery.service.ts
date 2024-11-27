import debug from 'debug'
import { Prisma } from 'prisma-sl'
import { CreateDiscoveryDto } from '../../db/dto/discovery/create.discovery.dto'
import { PatchDiscoveryDto } from '../../db/dto/discovery/patch.discovery.dto'
import { CRUD } from '../../db/interfaces/crud.interface'
import { DiscoveryPrismaDao } from '../../db/dao'

const log: debug.IDebugger = debug('sl-taxii:discovery.service')

class DiscoveryService implements CRUD {
  private discoveryDao: typeof DiscoveryPrismaDao

  constructor() {
    this.discoveryDao = DiscoveryPrismaDao
  }

  async create(resource: CreateDiscoveryDto) {
    try {
    
      const discovery = await this.discoveryDao.addDiscovery(resource)
      return Promise.resolve(discovery)
      
    } catch (e) {
      return Promise.reject(decodeError(e))
    }
  }
  
  async readById(id: string) {
    const discovery = await this.discoveryDao.getDiscoveryById(id)

    if (!discovery) {
      log('Request rejected')
      return Promise.reject(
        'The Discovery service is not found, or the client does not have access to the resource'
      )
    }

    return Promise.resolve(discovery)
  }
  
  async patchById(id: string, resource: PatchDiscoveryDto) {
    try {
    
      const discovery = await this.discoveryDao.updateDiscovery(id, resource)
      return Promise.resolve(discovery)
      
    } catch (e) {
      return Promise.reject(decodeError(e))
    }
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
    return Promise.reject('Illegal Operation')
  }

  /**
   * @deprecated The method should not be used
   */
  async putById(id: string, resource: any) {
    return Promise.reject('Illegal Operation')
  }

}

export default new DiscoveryService()

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
