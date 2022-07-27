import { injectable } from 'inversify'

import {logger} from '@common'
import {Schema} from '@common/types'

import { roomMap } from '@server'
import {IResponse} from '@server/response/interface'
import {ChatUser} from '@server/data'

import { ICommonController } from '../interface'

@injectable()
export class CommonController implements ICommonController {
  constructor() {}

  async ping(req: Schema.Common.PingReq, chatUser: ChatUser, res: IResponse<Schema.Common.PingRes>): Promise<void> {
    logger.debug(`ping: ${chatUser.id}`)
    await res.reply('Common.Ping', {
      success: true,
    })
  }
}
