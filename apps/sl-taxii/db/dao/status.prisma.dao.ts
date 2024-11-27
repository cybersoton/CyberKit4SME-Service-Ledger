import debug from 'debug'
import { CreateStatusDto } from '../dto/status/create.status.dto'
import { Status } from 'prisma-sl'

const log: debug.IDebugger = debug('sl-taxii:status.prisma.dao')

class StatusPrismaDao {
  async addStatus(statusCreationFields: CreateStatusDto) {
    return Status.create({
      data: {
        total_count: statusCreationFields.total_count,
        apiRootId: statusCreationFields.apiRootId,
        StatusDetail: statusCreationFields.StatusDetail,
      },
      include: {
        StatusDetail: true,
      },
    })
  }

  async getStatusById(apiRootId: string, statusId: string) {
    return Status.findUnique({
      where: {
        id_apiRootId: {
          apiRootId: apiRootId,
          id: statusId,
        },
      },
      include: {
        StatusDetail: true,
      },
    })
  }
  
  async updateStatus(apiRootId: string, statusId: string) {
    return Status.update({
      where: {
        id_apiRootId: {
          apiRootId: apiRootId,
          id: statusId,
        },
      },
      data: {
        status: 'complete',
      },
      include: {
        StatusDetail: true,
      },
    })
  }
}

export default new StatusPrismaDao()
