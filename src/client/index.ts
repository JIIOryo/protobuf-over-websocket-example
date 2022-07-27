import * as readline from 'readline'

import { WebSocket } from 'ws'

import {util} from '@common'
import {COLOR} from '@common/util'
import {config} from '@common/config'
import {Chat, Schema} from '@common/types'

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

client.on('message', (message) => {
  const data = JSON.parse(message.toString()) as Schema.Response

  switch (data.commandName) {
    case 'Common.Ping': {
      const parsedCommand = data.data as Schema.Common.PingRes
      if (parsedCommand.success) {
        break
      }
      console.log(`${COLOR.RED}ping failed${COLOR.RESET}`)
      break
    }
    case 'Room.Join': {
      const parsedData = data.data as Schema.Room.JoinRes

      const joinUserId = parsedData.userId
      const joinRoomId = parsedData.roomId
      
      // 自分以外の場合はスキップ
      if (joinUserId !== userId) {
        console.log(`\n${COLOR.YELLOW}${joinUserId}が${joinRoomId}に入室しました。${COLOR.RESET}`)
        break
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
    case 'Room.Leave': {
      const parsedData = data.data as Schema.Room.LeaveRes
      
      const beforeRoomId = parsedData.roomId
      const leaveUserId = parsedData.userId

      // 退出者が自分以外の場合は終了
      if (leaveUserId !== userId) {
        console.log(`\n${COLOR.YELLOW}${leaveUserId}が${beforeRoomId}を退出しました。${COLOR.RESET}`)
        break
      }
      
      joinedRoomId = undefined
      const success = data.data.success
      
      if (!success) {
        console.log('leave failed')
        break
      }
      console.log(`${COLOR.YELLOW}${userId}${COLOR.RED}(You)${COLOR.YELLOW}が${beforeRoomId}を退出しました。${COLOR.RESET}`)
      rl.setPrompt(generatePrompt(userId))
      break
    }
    case 'Room.Message': {
      const sendUserId = data.data.userId
      if (userId === sendUserId) {
        break
      }
      console.log(`\n${COLOR.GREEN}${sendUserId}${COLOR.RESET}: ${data.data.message}`)
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

      console.log(`${COLOR.GREEN}${userId}${COLOR.RED}(You)${COLOR.RESET} : ${line}`)

      return
    }
  }
})

setInterval(() => {
  if (!joinedRoomId) {
    return
  }
  const request: Schema.Request<Schema.Common.PingReq> = {
    commandName: 'Common.Ping',
    data: {}
  }
  client.send(JSON.stringify(request))
}, config.client.pingInterval)
