import {Schema} from '@common/types'
import {IResponse} from '@server/response/interface'

import {ChatUser} from '@server/data'

export interface IRoomController {
  /**
   * Roomに参加する
   */
  join(req: Schema.Room.JoinReq, user: ChatUser, res: IResponse<Schema.Room.JoinRes>): Promise<void>
  /**
   * Roomから退出する
   */
  leave(req: Schema.Room.LeaveReq, user: ChatUser, res: IResponse<Schema.Room.LeaveRes>): Promise<void>
  /**
   * Room内のユーザーにメッセージを送信する
   */
  message(req: Schema.Room.MessageReq, user: ChatUser, res: IResponse<Schema.Room.MessageRes>): Promise<void>
}
