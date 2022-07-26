import {Chat} from '@common/types'
import { ChatUserConnection } from '@server/data'

/**
 * Roomに参加するユーザー
 */
export class ChatUser {
  private _id: Chat.UserId
  private _connection: ChatUserConnection

  constructor(id: Chat.UserId, connection: ChatUserConnection) {
    this._id = id
    this._connection = connection
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
    this._connection.send(data)
  }
}
