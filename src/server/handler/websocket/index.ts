
import {Chat, Schema} from '@common/types'

import {logger} from '@common'

import {WebSocketResponse} from '@server/response/impl'

import {controller, roomMap} from '@server'
import {Room, ChatUser, ChatUserConnection, IConnection} from '@server/data'

export const websocketHandler = async (
  ws: Chat.WebSocket.Socket,
  roomId: Chat.RoomId,
  userId: Chat.UserId,
  message: string,
): Promise<void> => {

  const parsedMessage: Schema.Request = JSON.parse(message)
  /**
   * @example 'Room.Join'
   */
  const commandName = parsedMessage.commandName
  const data = parsedMessage.data

  // roomを取得する。存在しない場合は作成する
  let room = roomMap.get(roomId)
  if (!room) {
    room = new Room(roomId)
    roomMap.add(room)
  }

  // ユーザーを取得する。存在しない場合は作成する
  let chatUser = room.getUser(userId)
  if (!chatUser) {
    const _conn: IConnection = {
      send: async (message: string): Promise<void> => {
        return new Promise((resolve, reject) => {
          ws.send(message, (err) => {
            if (err) {
              logger.warn(err)
            }
            return resolve()
          })
        })
      }
    }
    const connection = new ChatUserConnection(_conn)
    chatUser = new ChatUser(userId, connection)
  }

  chatUser.updateLastActiveTime()

  switch (commandName) {
    case 'Common.Ping':
      await controller.common.ping(
        data,
        chatUser,
        new WebSocketResponse<Schema.Common.PingRes>(ws, room)
      )
      break
    case 'Room.Join':
      await controller.room.join(
        data as Schema.Room.JoinReq,
        chatUser,
        new WebSocketResponse<Schema.Room.JoinRes>(ws, room),
      )
      break
    case 'Room.Leave':
      await controller.room.leave(
        data as Schema.Room.LeaveReq,
        chatUser,
        new WebSocketResponse<Schema.Room.LeaveRes>(ws, room),
      )
      break
    case 'Room.Message':
      await controller.room.message(
        data as Schema.Room.MessageReq,
        chatUser,
        new WebSocketResponse<Schema.Room.MessageRes>(ws, room),
      )
      break
    default:
      logger.warn(`[WebSocketServer] commandName is invalid: ${commandName}`)
      break
  }

  return
}

