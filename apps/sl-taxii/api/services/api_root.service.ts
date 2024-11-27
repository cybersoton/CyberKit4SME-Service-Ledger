import debug from 'debug'
import { Prisma } from 'prisma-sl'
import { CreateAPIRootDto } from '../../db/dto/api_root/create.api_root.dto'
import { PatchAPIRootDto } from '../../db/dto/api_root/patch.api_root.dto'
import { CRUD } from '../../db/interfaces/crud.interface'
import { APIRootPrismaDao } from '../../db/dao'

const log: debug.IDebugger = debug('sl-taxii:api_root.service')

class APIRootService implements CRUD {
  private apiRootDao: typeof APIRootPrismaDao

  constructor() {
    this.apiRootDao = APIRootPrismaDao
  }

  async create(resource: CreateAPIRootDto, hostname?: string, slug?: string, digest?: string) {
    const port = '6023'
    let apiroot = undefined
    
    try {
      resource.id = digest!
      resource.domain = `https://${hostname}:${port}`
      resource.slug = slug!
      resource.max_content_length = 104857600
      resource.versions = ["application/taxii+json;version=2.1"]
      resource.discoveryId = "taxii2"

      apiroot = await this.apiRootDao.addAPIRoot(resource)

      return Promise.resolve({ apiroot })
      
    } catch (e) {
      if (apiroot) {
        await this.apiRootDao.deleteAPIRootById(apiroot?.id)
      }
      return Promise.reject(decodeError(e))
    }
  }
  
  async readById(id: string) {
    const apiroot = await this.apiRootDao.getAPIRootById(id)

    if (!apiroot) {
      log('Request rejected')
      return Promise.reject(
        'The APIRoot is not found, or the client does not have access to the resource'
      )
    }

    return Promise.resolve(apiroot)
  }
  
  async patchById(id: string, resource: PatchAPIRootDto) {
    try {
    
      const apiroot = await this.apiRootDao.updateAPIRoot(id, resource)
      return Promise.resolve({ apiroot })
      
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

export default new APIRootService()

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
