import * as readline from 'readline'

import { WebSocket } from 'ws'

import {config} from '@common/config'
import {Chat, Schema} from '@common/types'
import {util} from '@common'

const generatePrompt = (userId: Chat.UserId, roomId?: Chat.RoomId): string => {
  if (roomId) {
    return `${userId}@${roomId} > `
  } else {
    return `${userId} > `
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

client.on('message', (message) => {
  const data = JSON.parse(message.toString()) as Schema.Response

  switch (data.commandName) {
    case 'Room.Join': {
      joinedRoomId = data.data.roomId
      const success = data.data.success
      if (!success) {
        console.log('join failed')
        break
      }
      console.log(`join success! roomId: ${joinedRoomId}`)
      rl.setPrompt(generatePrompt(userId, joinedRoomId))
      break
    }
    case 'Room.Leave': {
      const beforeRoomId = joinedRoomId
      joinedRoomId = undefined
      const success = data.data.success
      if (!success) {
        console.log('leave failed')
        break
      }
      console.log(`leave success! roomId: ${beforeRoomId}`)
      rl.setPrompt(generatePrompt(userId))
      break
    }
    case 'Room.Message': {
      console.log(`\n${data.data.userId}: ${data.data.message}`)
      break
    }
    default: {
      console.warn(`unknown command from server ${data.commandName}`)
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

      const request: Schema.Request<Schema.Room.JoinReq> = {
        commandName: 'Room.Join',
        data: {
          userId,
          roomId: parsedRoomId,
        }
      }
      client.send(JSON.stringify(request))
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

      const request: Schema.Request<Schema.Room.LeaveReq> = {
        commandName: 'Room.Leave',
        data: {
          userId,
          roomId: parsedRoomId,
        }
      }

      client.send(JSON.stringify(request))
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
      const request: Schema.Request<Schema.Room.MessageReq> = {
        commandName: 'Room.Message',
        data: {
          userId,
          roomId: joinedRoomId,
          message: line,
        }
      }

      client.send(JSON.stringify(request))

      return
    }
  }
})
