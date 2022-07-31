
import {Chat, Schema, TransportSchema} from '@common/types'

import {logger, protocol, command} from '@common'

// FIXME
import {JsonSerializer, ProtobufSerializer} from '@common/serializer/impl'

import {WebSocketResponse} from '@server/response/impl'

import {controller, roomMap} from '@server'
import {Room, ChatUser, ChatUserConnection, IConnection} from '@server/data'

// const serializer = new JsonSerializer<TransportSchema.All>()
const serializer = new ProtobufSerializer<TransportSchema.NameSchemaMap>([
  __dirname + '../../../../../proto/common.proto',
  __dirname + '../../../../../proto/room.proto',
])

export const websocketHandler = async (
  ws: Chat.WebSocket.Socket,
  roomId: Chat.RoomId,
  userId: Chat.UserId,
  message: Buffer,
): Promise<void> => {

  // const parsedMessage: Schema.Request = JSON.parse(message)
  const _header = message.slice(0, 4)
  const _body = message.slice(4)
  const header = protocol.gupio.v1.parseRequestHeader(_header)
  const commandId = header.commandId
  if (!command.isCmdId(commandId)) {
    logger.error(`invalid commandId: ${commandId}`)
    return
  }
  /**
   * @example 'room.JoinReq'
   */
  const commandName = command.idCmdMap[commandId]

  const data = serializer.deserialize(commandName, _body)

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
    case 'common.PingReq':
      await controller.common.ping(
        data,
        chatUser,
        new WebSocketResponse<Schema.Common.PingRes>(ws, room)
      )
      break
    case 'room.JoinReq':
      await controller.room.join(
        data as Schema.Room.JoinReq,
        chatUser,
        new WebSocketResponse<Schema.Room.JoinRes>(ws, room),
      )
      break
    case 'room.LeaveReq':
      await controller.room.leave(
        data as Schema.Room.LeaveReq,
        chatUser,
        new WebSocketResponse<Schema.Room.LeaveRes>(ws, room),
      )
      break
    case 'room.MessageReq':
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

