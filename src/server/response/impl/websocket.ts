import {IResponse} from '../interface'

import {logger, protocol, command, serializer as _serializer} from '@common'
import {Chat, Schema, TransportSchema} from '@common/types'
import {_} from '@common/util'

import {Room} from '@server/data'

const serializer = new _serializer.Impl.ProtobufSerializer<TransportSchema.NameSchemaMap>([
  __dirname + '../../../../../proto/common.proto',
  __dirname + '../../../../../proto/room.proto',
])

export class WebSocketResponse<Res extends object = object> implements IResponse<Res> {
  private _socket: Chat.WebSocket.Socket
  private _room: Room

  constructor(socket: Chat.WebSocket.Socket, room: Room) {
    this._socket = socket
    this._room = room
  }

  async reply(commandName: TransportSchema.CommandNames, data: Res): Promise<void> {
    // const res: Schema.Response = {
    //   commandName: commandName,
    //   data,
    // }
    
    const header = protocol.gupio.v1.buildResponseHeader({
      commandId: command.cmdIdMap[commandName],
      protocolVersion: 0,
      encoding: 1,
      error: false,
    })
    const body = serializer.serialize(commandName, data)
    const buffer = Buffer.concat([header, body])

    return new Promise((resolve, reject) => {
      this._socket.send(buffer, (err) => {
        if (err) {
          logger.error(err)
        }
        return resolve()
      })
    })
  }

  async broadcast(commandName: TransportSchema.CommandNames, data: Res): Promise<void> {
    // const res: Schema.Response = {
    //   commandName,
    //   data,
    // }

    const header = protocol.gupio.v1.buildResponseHeader({
      commandId: command.cmdIdMap[commandName],
      protocolVersion: 0,
      encoding: 1,
      error: false,
    })
    const body = serializer.serialize(commandName, data)
    const buffer = Buffer.concat([header, body])

    await Promise.all(
      Object.entries(this._room.users).map(async ([userId, chatUser]) => {
        await chatUser.send(buffer)
      })
    )
  }
}
