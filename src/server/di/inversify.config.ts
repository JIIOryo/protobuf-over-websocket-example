import {Container} from 'inversify'

import {Config} from '@common/types'
import * as Identifier from './identifier'
import * as config from '@common/config'
import * as server from '@server/server'
import * as controller from '@server/controller'

const rootContainer = new Container()

rootContainer.bind<Config>(Identifier.Config).toConstantValue(config.config)
rootContainer.bind<server.Interface.IServer>(Identifier.IServer).to(server.Impl.websocket.WebSocketServer)
rootContainer.bind<controller.Interface.IRoomController>(Identifier.Controller.Room).to(controller.Impl.RoomController)

export const container = rootContainer
