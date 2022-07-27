import {Schema} from '@common/types'
import {IResponse} from '@server/response/interface'

import {ChatUser} from '@server/data'

export interface ICommonController {
  /**
   * ping
   */
  ping(req: Schema.Common.PingReq, user: ChatUser, res: IResponse<Schema.Common.PingRes>): Promise<void>
}
