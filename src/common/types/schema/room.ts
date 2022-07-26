import {Chat} from '@common/types'

export type JoinReq = {
  roomId: Chat.RoomId
  userId: Chat.UserId
}
export type JoinRes = {
  roomId: Chat.RoomId
  success: boolean
}

export type LeaveReq = {
  roomId: Chat.RoomId
  userId: Chat.UserId
}
export type LeaveRes = {
  roomId: Chat.RoomId
  success: boolean
}

export type MessageReq = {
  roomId: Chat.RoomId
  userId: Chat.UserId
  message: string
}
export type MessageRes = {
  roomId: Chat.RoomId
  userId: Chat.UserId
  message: string
}
