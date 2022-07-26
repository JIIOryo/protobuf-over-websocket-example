
import {container} from '@server/di/inversify.config'
import * as Identifier from '@server/di/identifier'

import * as _server from '@server/server'
import * as _controller from '@server/controller'
import {RoomMap} from '@server/data'

export const server = container.get<_server.Interface.IServer>(Identifier.IServer)
export const controller = {
  room: container.get<_controller.Interface.IRoomController>(Identifier.Controller.Room)
}
export const roomMap = new RoomMap()
