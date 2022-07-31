
/**
 * key: command name
 * value: command id
 */
export const command = {
  // Common
  common: {
    ping: {
      req: {
        id: 1000,
        name: 'common.PingReq',
      },
      res: {
        id: 1001,
        name: 'common.PingRes',
      },
    }
  },

  //Room
  room: {
    join: {
      req: {
        id: 2000,
        name: 'room.JoinReq',
      },
      res: {
        id: 2001,
        name: 'room.JoinRes',
      },
    },
    leave: {
      req: {
        id: 2002,
        name: 'room.LeaveReq',
      },
      res: {
        id: 2003,
        name: 'room.LeaveRes',
      },
    },
    message: {
      req: {
        id: 2004,
        name: 'room.MessageReq',
      },
      res: {
        id: 2005,
        name: 'room.MessageRes',
      },
    }
  }
} as const

export const idCmdMap = {
  // Common
  [command.common.ping.req.id]: command.common.ping.req.name,
  [command.common.ping.res.id]: command.common.ping.res.name,

  // Room
  [command.room.join.req.id]: command.room.join.req.name,
  [command.room.join.res.id]: command.room.join.res.name,
  [command.room.leave.req.id]: command.room.leave.req.name,
  [command.room.leave.res.id]: command.room.leave.res.name,
  [command.room.message.req.id]: command.room.message.req.name,
  [command.room.message.res.id]: command.room.message.res.name,
} as const

export const cmdIdMap = {
  // Common
  [command.common.ping.req.name]: command.common.ping.req.id,
  [command.common.ping.res.name]: command.common.ping.res.id,

  // Room
  [command.room.join.req.name]: command.room.join.req.id,
  [command.room.join.res.name]: command.room.join.res.id,
  [command.room.leave.req.name]: command.room.leave.req.id,
  [command.room.leave.res.name]: command.room.leave.res.id,
  [command.room.message.req.name]: command.room.message.req.id,
  [command.room.message.res.name]: command.room.message.res.id,
} as const

export type CmdId = keyof typeof idCmdMap

export const isCmdId = (id: number): id is CmdId => {
  return id in idCmdMap
}
