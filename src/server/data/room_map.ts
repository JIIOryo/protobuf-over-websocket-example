import {Room} from '@server/data'

import {Chat} from '@common/types'

export class RoomMap {
  private rooms: Map<Chat.RoomId, Room> = new Map();

  /**
   * ルームを取得する
   * @param id ルームID
   * @returns ルームが存在する場合はルームを返す
   */
  public get(id: Chat.RoomId): Room | null {
    return this.rooms.get(id) || null
  }

  /**
   * ルームを追加する
   * @param room 新しいルーム
   */
  public add(room: Room): void {
    this.rooms.set(room.id, room)
  }

  /**
   * ルームを削除する
   * @param id ルームID
   */
  public remove(id: Chat.RoomId): void {
    this.rooms.delete(id)
  }
}
