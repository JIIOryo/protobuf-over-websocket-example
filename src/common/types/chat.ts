import * as ws from 'ws'

export namespace WebSocket {
  export type Socket = ws

  export type SocketMap = {[_RoomId in RoomId]: {[_UserId in UserId]: Socket}}
}

export type RoomId = `room-${string}`

export type UserId = string
