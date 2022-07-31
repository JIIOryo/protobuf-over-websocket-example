import {TransportSchema} from '@common/types'

export interface IResponse<Res extends object = object> {
  /**
   * 返信する
   */
  reply: (commandName: TransportSchema.CommandNames, data: Res) => Promise<void>
  /**
   * Roomの全員にメッセージを送信する
   */
  broadcast: (commandName: TransportSchema.CommandNames, data: Res) => Promise<void>
}
