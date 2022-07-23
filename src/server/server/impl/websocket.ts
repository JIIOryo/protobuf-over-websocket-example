import * as ws from 'ws'
import {inject, injectable} from 'inversify'

import * as Identifier from '@server/di/identifier'
import {Config} from '@server/types'

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
      console.log('WebSocketServer setup')
      resolve()
    })
  }

  public start(): Promise<void> {
    console.log(`WebSocketServer start listening on port: ${this.port}`)
    return new Promise((resolve, reject) => {
      this.wss.on('connection', (ws) => {
        ws.on('message', (message) => {
          console.log(message)
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
