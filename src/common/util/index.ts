import * as _ from 'lodash'
import {Chat} from '@common/types'

export * as _ from './_'

export const isRoomId = (id: string): id is Chat.RoomId => {
  return id.startsWith('room-') && id.length > 5
}

export const isUserId = (id: string): id is Chat.UserId => {
  return id.length > 0
}
