
export interface IResponse<Res extends object = object> {
  /**
   * 返信する
   */
  reply: (commandName: string, data: Res) => Promise<void>
  /**
   * Roomの全員にメッセージを送信する
   */
  broadcast: (commandName: string, data: Res) => Promise<void>
}
