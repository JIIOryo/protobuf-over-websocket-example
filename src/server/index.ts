
import {container} from '@server/di/inversify.config'
import * as Identifier from '@server/di/identifier'

import * as _server from '@server/server'

export const server = container.get<_server.Interface.IServer>(Identifier.IServer)
