import debug from 'debug'
import { CreateAPIRootDto } from '../dto/api_root/create.api_root.dto'
import { PatchAPIRootDto } from '../dto/api_root/patch.api_root.dto'
import { APIRoot } from 'prisma-sl'

const log: debug.IDebugger = debug('sl-taxii:api_root.prisma.dao')

class APIRootPrismaDao {
  async addAPIRoot(apiRootCreationFields: CreateAPIRootDto) {
    return APIRoot.create({
          data: {
            ...apiRootCreationFields,
          },
        })
  }

  async getAPIRootById(apiRootId: string) {
    return APIRoot.findUnique({
      where: {
        id: apiRootId,
      },
    })
  }

  async updateAPIRoot(apiRootId: string, apiRootPatchFields: PatchAPIRootDto) {
    return APIRoot.update({
      where: {
        id: apiRootId,
      },
      data: {
        ...apiRootPatchFields,
      },
    })
  }
  
  async deleteAPIRootById(id: string) {
    return APIRoot.delete({
      where: {
        id: id,
      },
    })
  }
}

/*
    try {
      return Promise.resolve(
        // calls prisma.create
      )
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (e.code === 'P2002') {
          console.log(
            'There is a unique constraint violation, a new APIRoot cannot be created with this parameters'
          )
        }
      }
      return Promise.reject((e as Prisma.PrismaClientKnownRequestError).meta)
    }
*/

export default new APIRootPrismaDao()
