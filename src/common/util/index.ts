import * as _ from 'lodash'
import {Chat} from '@common/types'

export * as _ from './_'

export const isRoomId = (id: string): id is Chat.RoomId => {
  return id.startsWith('room-') && id.length > 5
}

export const isUserId = (id: string): id is Chat.UserId => {
  return id.length > 0
}

export const COLOR = {
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  MAGENTA: '\x1b[35m',
  RESET: '\x1b[0m',
}
