import debug from 'debug'
import { CreateDiscoveryDto } from '../dto/discovery/create.discovery.dto'
import { PatchDiscoveryDto } from '../dto/discovery/patch.discovery.dto'

import { Discovery } from 'prisma-sl'

const log: debug.IDebugger = debug('sl-taxii:discovery.prisma.dao')

class DiscoveryPrismaDao {
  async addDiscovery(discoveryCreationFields: CreateDiscoveryDto) {
    return Discovery.create({
      data: {
        ...discoveryCreationFields,
      },
    })
  }

  async getDiscoveryById(discoveryId: string) {
    return Discovery.findUnique({
      where: {
        id: discoveryId,
      },
      include: {
        APIRoot: true,
      },
    })
  }

  async updateDiscovery(
    discoveryId: string,
    discoveryPatchFields: PatchDiscoveryDto
  ) {
    return Discovery.update({
      where: {
        id: discoveryId,
      },
      data: {
        ...discoveryPatchFields,
      },
    })
  }
}

export default new DiscoveryPrismaDao()
