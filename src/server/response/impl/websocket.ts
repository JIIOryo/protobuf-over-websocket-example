import {IResponse} from '../interface'

import {Chat, Schema} from '@common/types'
import {_} from '@common/util'

import {Room} from '@server/data'

export class WebSocketResponse<Res extends object = object> implements IResponse<Res> {
  private _socket: Chat.WebSocket.Socket
  private _room: Room

  constructor(socket: Chat.WebSocket.Socket, room: Room) {
    this._socket = socket
    this._room = room
  }

  async reply(commandName: string, data: Res): Promise<void> {
    const res: Schema.Response = {
      commandName: commandName,
      data,
    }
    return new Promise((resolve, reject) => {
      this._socket.send(JSON.stringify(res), (err) => {
        if (err) {
          console.error(err)
        }
        return resolve()
      })
    })
  }

  async broadcast(data: Res): Promise<void> {
    await Promise.all(
      Object.entries(this._room.users).map(async ([userId, chatUser]) => {
        await chatUser.send(JSON.stringify(data))
      })
    )
  }
}
