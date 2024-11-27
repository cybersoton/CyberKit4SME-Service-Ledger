import debug from 'debug'
import { Prisma } from 'prisma-sl'
import { CreateStatusDto } from '../../db/dto/status/create.status.dto'
import { StatusPrismaDao } from '../../db/dao'

const log: debug.IDebugger = debug('sl-taxii:status-service')

class StatusService {
  private statusDao: typeof StatusPrismaDao

  constructor() {
    this.statusDao = StatusPrismaDao
  }

  async readById(apiRootId: string, statusId: string) {
    const status = await this.statusDao.getStatusById(apiRootId, statusId)

    if (!status) {
      log('Request rejected')
      return Promise.reject(
        'The API Root or Status ID are not found, or the client does not have access to the resource'
      )
    }

    return Promise.resolve(status)
  }
  
  async update(apiRootId: string, statusId: string) {
    const status = await this.statusDao.updateStatus(apiRootId, statusId)

    if (!status) {
      log('Request rejected')
      return Promise.reject(
        'The API Root or Status ID are not found, or the client does not have access to the resource'
      )
    }

    return Promise.resolve(status)
  }

  async create(resource: CreateStatusDto) {
    try {
      const status = await this.statusDao.addStatus(resource)
      return Promise.resolve(status)
      
    } catch (e) {
      return Promise.reject(decodeError(e))
    }
  }
}

export default new StatusService()

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
