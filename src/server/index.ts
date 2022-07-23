
import {container} from './di/inversify.config'
import * as Identifier from './di/identifier'

import * as _server from './server'

export const server = container.get<_server.Interface.IServer>(Identifier.IServer)
