import { StatusDetail } from '.prisma/client'
import { CreateStatusDetailDto } from '../status_detail/create.status_detail.dto'

export interface CreateStatusDto {
  total_count: number
  apiRootId: string
  StatusDetail: {
    createMany: {
      data: Array<StatusDetail>
    }
  }
}
