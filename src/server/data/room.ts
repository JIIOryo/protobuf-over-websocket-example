
import {Chat} from '@common/types'
import {ChatUser} from '@server/data'

export class Room {
  /**
   * room id
   */
  public readonly id: Chat.RoomId

  /**
   * ユーザー
   */
  public readonly users: {[UserId in Chat.UserId]: ChatUser} = {}

  constructor(
    id: Chat.RoomId,
  ) {
    this.id = id
  }

  /**
   * ユーザーを追加する
   * @param user ユーザー
   */
  public join(user: ChatUser): void {
    this.users[user.id] = user
  }

  /**
   * ユーザーを取得する
   * @param userId ユーザーid
   * @returns ユーザーが存在する場合はユーザーを返す
   */
  public getUser(userId: Chat.UserId): ChatUser | null {
    return this.users[userId] || null
  }

  /**
   * ユーザーを削除する
   * @param userId
   */
  public leave(userId: Chat.UserId): void {
    delete this.users[userId]
  }
}
