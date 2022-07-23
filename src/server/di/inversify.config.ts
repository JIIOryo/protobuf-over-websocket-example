import {Container} from 'inversify'

import {Config} from '../types'
import * as Identifier from './identifier'
import * as config from '../config'
import * as server from '../server'

const rootContainer = new Container()

rootContainer.bind<Config>(Identifier.Config).toConstantValue(config.config)
rootContainer.bind<server.Interface.IServer>(Identifier.IServer).to(server.Impl.websocket.WebSocketServer)

export const container = rootContainer
