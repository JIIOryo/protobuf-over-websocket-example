import { logger, config } from '@common'
import {Chat, Util} from '@common/types'
import { ChatUserConnection } from '@server/data'

type UserStatus = Util.ValueOf<typeof ChatUser.STATUS>
type SystemInfo = {
  /**
   * 最終アクセス日時
   */
  lastActiveTime: Util.Timestamp
}

/**
 * Roomに参加するユーザー
 */
export class ChatUser {
  private _id: Chat.UserId
  private _connection: ChatUserConnection
  private _systemInfo: SystemInfo = {
    lastActiveTime: 0,
  }

  private _status: UserStatus = ChatUser.STATUS.INITIALIZED

  constructor(id: Chat.UserId, connection: ChatUserConnection) {
    this._id = id
    this._connection = connection
  }

  public static readonly STATUS = {
    INITIALIZED: 'initialized',
    ACTIVE: 'active',
    TIMEOUT: 'timeout',
  } as const

  public setStatus(status: UserStatus) {
    this._status = status
  }
  public getStatus(): UserStatus {
    return this._status
  }

  public updateLastActiveTime() {
    this._systemInfo.lastActiveTime = Date.now()
  }

  /**
   * ユーザーのIDを取得する
   * @returns ユーザーID
   */
  get id(): Chat.UserId {
    return this._id
  }

  /**
   * ユーザーにメッセージを送信する
   * @param data 送信するデータ
   */
  public async send(data: any): Promise<void> {
    const now = Date.now()

    // タイムアウトのクライアントは無視する
    if (this._systemInfo.lastActiveTime + config.server.chatUser.timeout < now) {
      logger.warn(`ChatUser#send ignore timeout client. id: ${this._id}`)
      // タイムアウトにする
      this.setStatus(ChatUser.STATUS.TIMEOUT)
      return
    }

    await this._connection.send(data)
  }
}
