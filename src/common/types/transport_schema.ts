/**
 * @fileoverview protobufで自動生成された型
 */

import * as _Common from '@proto/common'
import * as _Room from '@proto/room'

import {command} from '@common/command'

export type IdSchemaMap = {
  // Common
  [command.common.ping.req.id]: _Common.PingReq
  [command.common.ping.res.id]: _Common.PingRes

  // Room
  [command.room.join.req.id]: _Room.JoinReq
  [command.room.join.res.id]: _Room.JoinRes
  [command.room.leave.req.id]: _Room.LeaveReq
  [command.room.leave.res.id]: _Room.LeaveRes
  [command.room.message.req.id]: _Room.MessageReq
  [command.room.message.res.id]: _Room.MessageRes
}

export type NameSchemaMap = {
  // Common
  [command.common.ping.req.name]: _Common.PingReq
  [command.common.ping.res.name]: _Common.PingRes

  // Room
  [command.room.join.req.name]: _Room.JoinReq
  [command.room.join.res.name]: _Room.JoinRes
  [command.room.leave.req.name]: _Room.LeaveReq
  [command.room.leave.res.name]: _Room.LeaveRes
  [command.room.message.req.name]: _Room.MessageReq
  [command.room.message.res.name]: _Room.MessageRes
}

export type CommandNames = keyof NameSchemaMap 
