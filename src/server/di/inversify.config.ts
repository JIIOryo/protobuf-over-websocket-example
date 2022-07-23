import {Container} from 'inversify'

import {Config} from '@server/types'
import * as Identifier from './identifier'
import * as config from '@server/config'
import * as server from '@server/server'

const rootContainer = new Container()

rootContainer.bind<Config>(Identifier.Config).toConstantValue(config.config)
rootContainer.bind<server.Interface.IServer>(Identifier.IServer).to(server.Impl.websocket.WebSocketServer)

export const container = rootContainer
