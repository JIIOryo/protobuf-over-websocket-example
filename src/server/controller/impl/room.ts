import { injectable } from 'inversify'

import {logger} from '@common'
import {Schema} from '@common/types'

import { roomMap } from '@server'
import {IResponse} from '@server/response/interface'
import {ChatUser} from '@server/data'

import { IRoomController } from '../interface'

@injectable()
export class RoomController implements IRoomController {
  constructor() {}

  async join(req: Schema.Room.JoinReq, chatUser: ChatUser, res: IResponse<Schema.Room.JoinRes>): Promise<void> {
    const roomId = req.roomId
    const room = roomMap.get(roomId)

    if (!room) {
      logger.error(`Room not found: ${roomId}`)
      // TODO: Errorメッセージを返す
      await res.reply('Room.Join', {
        roomId,
        userId: chatUser.id,
        success: false,
      })
      return
    }

    // Roomに参加する
    room.join(chatUser)
    
    await res.broadcast('Room.Join', {
      roomId,
      userId: chatUser.id,
      success: true,
    })
  }

  async leave(req: Schema.Room.LeaveReq, chatUser: ChatUser, res: IResponse<Schema.Room.LeaveRes>): Promise<void> {
    const roomId = req.roomId
    const room = roomMap.get(roomId)

    if (!room) {
      logger.error(`Room not found: ${roomId}`)
      // TODO: Errorメッセージを返す
      await res.reply('Room.Leave', {
        roomId,
        userId: chatUser.id,
        success: false,
      })
      return
    }

    // Roomから退出する
    room.leave(chatUser.id)

    await res.broadcast('Room.Leave', {
      roomId,
      userId: chatUser.id,
      success: true,
    })
    // leaveした人に対してはbroadcastでは届かないのでreplyで送信する
    await res.reply('Room.Leave', {
      roomId,
      userId: chatUser.id,
      success: true,
    })
  }

  async message(req: Schema.Room.MessageReq, chatUser: ChatUser, res: IResponse<Schema.Room.MessageRes>): Promise<void> {
    const roomId = req.roomId
    const room = roomMap.get(roomId)

    if (!room) {
      logger.error(`Room not found: ${roomId}`)
    }

    // Room内のユーザーにメッセージを送信する
    await res.broadcast('Room.Message', {
      roomId,
      userId: chatUser.id,
      message: req.message,
    })
  }
}
