import * as readline from 'readline'

import { WebSocket } from 'ws'

import {util, command} from '@common'
import {COLOR, isRoomId} from '@common/util'
import {config} from '@common/config'
import {Chat, Schema, TransportSchema} from '@common/types'
import * as protocol from '@common/protocol'
import { JsonSerializer, ProtobufSerializer } from '@common/serializer/impl'

// const serializer = new JsonSerializer<TransportSchema.All>()
const serializer = new ProtobufSerializer<TransportSchema.NameSchemaMap>([
  __dirname + '/../../proto/common.proto',
  __dirname + '/../../proto/room.proto',
])

const generatePrompt = (userId: Chat.UserId, roomId?: Chat.RoomId): string => {
  if (roomId) {
    return `${COLOR.BLUE}${userId}@${roomId} >${COLOR.RESET} `
  } else {
    return `${COLOR.BLUE}${userId} >${COLOR.RESET} `
  }
}

const userId = process.argv[2]
if (!userId) {
  console.log('userId is required')
  process.exit(1)
}

const roomId = process.argv[3]
if (!roomId) {
  console.log('roomId is required')
  process.exit(1)
}
const client = new WebSocket(`ws://localhost:${config.server.port}/${roomId}?userId=${userId}`)

let joinedRoomId: Chat.RoomId | undefined = undefined

client.on('open', ()=> {
  console.log('connected')
  rl.prompt()
})

client.on('message', (message: Buffer) => {
  // const data = JSON.parse(message.toString()) as Schema.Response

  const _header = message.slice(0, 3)
  const _body = message.slice(3)
  const header = protocol.gupio.v1.parseResponseHeader(_header)
  const commandId = header.commandId

  if (!command.isCmdId(commandId)) {
    console.error('unknown cmdId')
    return
  }
  const commandName = command.idCmdMap[commandId]
  const data = serializer.deserialize(commandName, _body)

  switch (commandName) {
    case command.command.common.ping.res.name: {
      const parsedCommand = data as TransportSchema.NameSchemaMap[typeof commandName]
      if (parsedCommand.success) {
        break
      }
      console.log(`${COLOR.RED}ping failed${COLOR.RESET}`)
      break
    }
    case command.command.room.join.res.name: {
      const parsedData = data as TransportSchema.NameSchemaMap[typeof commandName]

      const joinUserId = parsedData.userId
      const joinRoomId = parsedData.roomId
      
      // 自分以外の場合はスキップ
      if (joinUserId !== userId) {
        console.log(`\n${COLOR.YELLOW}${joinUserId}が${joinRoomId}に入室しました。${COLOR.RESET}`)
        break
      }

      if (!isRoomId(parsedData.roomId)) {
        console.error('invalid roomId')
        return
      }

      joinedRoomId = parsedData.roomId
      const success = parsedData.success
      if (!success) {
        console.log('join failed')
        break
      }
      console.log(`${COLOR.YELLOW}${userId}${COLOR.RED}(You)${COLOR.YELLOW}が${joinRoomId}に入室しました。${COLOR.RESET}`)
      rl.setPrompt(generatePrompt(userId, joinedRoomId))
      break
    }
    case command.command.room.leave.res.name: {
      const parsedData = data as TransportSchema.NameSchemaMap[typeof commandName]
      
      const beforeRoomId = parsedData.roomId
      const leaveUserId = parsedData.userId

      // 退出者が自分以外の場合は終了
      if (leaveUserId !== userId) {
        console.log(`\n${COLOR.YELLOW}${leaveUserId}が${beforeRoomId}を退出しました。${COLOR.RESET}`)
        break
      }
      
      joinedRoomId = undefined
      const success = parsedData.success
      
      if (!success) {
        console.log('leave failed')
        break
      }
      console.log(`${COLOR.YELLOW}${userId}${COLOR.RED}(You)${COLOR.YELLOW}が${beforeRoomId}を退出しました。${COLOR.RESET}`)
      rl.setPrompt(generatePrompt(userId))
      break
    }
    case command.command.room.message.res.name: {
      const parsedData = data as TransportSchema.NameSchemaMap[typeof commandName]
      const sendUserId = parsedData.userId
      if (userId === sendUserId) {
        break
      }
      console.log(`\n${COLOR.GREEN}${sendUserId}${COLOR.RESET}: ${parsedData.message}`)
      break
    }
    default: {
      console.warn(`unknown command from server commandId: ${commandId}`)
      break
    }
  }
  rl.prompt()
})

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: generatePrompt(userId),
})

rl.on('line', (line) => {
  if (!line) {
    rl.prompt()
    return
  }

  const parsedCommand = line.split(' ')
  switch (parsedCommand[0]) {
    case 'exit':
    case 'quit': {
      rl.close()
      client.close(1008, 'close dayo')
      process.exit(0)
    }
    case 'join': {
      if (parsedCommand.length !== 2) {
        console.log('join command requires roomId')
        rl.prompt()
        return
      }

      const parsedRoomId = parsedCommand[1]
      if (!util.isRoomId(parsedRoomId)) {
        console.log('roomId is invalid')
        rl.prompt()
        return
      }

      const data: Schema.Room.JoinReq = {userId, roomId: parsedRoomId}
      const serializedData = serializer.serialize(command.command.room.join.req.name, data)
      const headerBuffer = protocol.gupio.v1.buildRequestHeader({
        commandId: command.command.room.join.req.id,
        encoding: 1,
        protocolVersion: 0,
      })
      client.send(Buffer.concat([headerBuffer, serializedData]))

      return
    }
    case 'leave': {
      if (parsedCommand.length !== 2) {
        console.log('leave command requires roomId')
        rl.prompt()
        return
      }

      const parsedRoomId = parsedCommand[1]
      if (!util.isRoomId(parsedRoomId)) {
        console.log('roomId is invalid')
        rl.prompt()
        return
      }

      const data: Schema.Room.LeaveReq = {userId, roomId: parsedRoomId}
      const serializedData = serializer.serialize(command.command.room.leave.req.name, data)
      const headerBuffer = protocol.gupio.v1.buildRequestHeader({
        commandId: command.command.room.leave.req.id,
        encoding: 1,
        protocolVersion: 0,
      })
      client.send(Buffer.concat([headerBuffer, serializedData]))

      return
    }
    default: {

      // Roomにjoinしていない場合は何もしない
      if (!joinedRoomId) {
        console.log('you are not in any room')
        rl.prompt()
        return
      }

      // messageを送信
      const data: Schema.Room.MessageReq = {userId, roomId: joinedRoomId, message: line}
      const serializedData = serializer.serialize(command.command.room.message.req.name, data)
      const headerBuffer = protocol.gupio.v1.buildRequestHeader({
        commandId: command.command.room.message.req.id,
        encoding: 1,
        protocolVersion: 0,
      })
      client.send(Buffer.concat([headerBuffer, serializedData]))

      console.log(`${COLOR.GREEN}${userId}${COLOR.RED}(You)${COLOR.RESET} : ${line}`)

      return
    }
  }
})

setInterval(() => {
  if (!joinedRoomId) {
    return
  }

  const data: Schema.Common.PingReq = {}
  const serializedData = serializer.serialize(command.command.common.ping.req.name, data)
  const headerBuffer = protocol.gupio.v1.buildRequestHeader({
    commandId: command.command.common.ping.req.id,
    encoding: 1,
    protocolVersion: 0,
  })
  client.send(Buffer.concat([headerBuffer, serializedData]))

}, config.client.pingInterval)
