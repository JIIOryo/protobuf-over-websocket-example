import * as ws from 'ws'
import {inject, injectable} from 'inversify'

import {Config, Chat} from '@common/types'
import { util } from '@common'

import * as Identifier from '@server/di/identifier'
import {websocketHandler} from '@server/handler'

import { IServer } from '../interface'

@injectable()
export class WebSocketServer implements IServer {
  private wss: ws.Server
  private port: number

  constructor(
    @inject(Identifier.Config) private config: Config
  ) {
    this.port = this.config.server.port
    this.wss = new ws.Server({ port: this.port })
  }
  
  public setup(): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('[WebSocketServer] setup')
      resolve()
    })
  }

  public start(): Promise<void> {
    console.log(`[WebSocketServer] start listening on port: ${this.port}`)
    return new Promise((resolve, reject) => {
      this.wss.on('connection', (socket, req) => {
        /**
         * @example '/{roomId}?userId={userId}'
         */
        const url = req.url

        if (!url) {
          console.warn('[WebSocketServer] connection url is empty')
          socket.close()
          return
        }

        // FIXME: パース処理をちゃんとする
        const roomId = url.split('?')[0].split('/')[1]
        if (!util.isRoomId(roomId)) {
          console.warn('[WebSocketServer] connection url roomId is invalid')
          socket.close()
          return
        }
        // FIXME: パース処理をちゃんとする
        const userId = url.split('?')[1].split('=')[1]
        if (!util.isUserId(userId)) {
          console.warn('[WebSocketServer] connection url userId is invalid')
          socket.close()
          return
        }

        console.log(`[WebSocketServer] connection! userId: ${userId}, roomId: ${roomId}`)

        socket.on('message', (message) => {
          console.log('[WebSocketServer] on message:', message.toString())
          const data = message.toString()
          websocketHandler(socket, roomId, userId, data)
        })
      })
      resolve()
    })
  }

  public stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.wss.close()
      resolve()
    })
  }
}
