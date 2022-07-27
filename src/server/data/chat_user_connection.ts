
/**
 * connectionのinterface
 * - websocketなどのconnectionを抽象化したもの
 */
export interface IConnection {
  send: (data: any) => Promise<void>
}

/**
 * ChatUserのConnectionをラップしたクラス
 */
export class ChatUserConnection {
  private _connection: IConnection
  constructor(connection: IConnection) {
    this._connection = connection
  }

  async send(data: any): Promise<void> {
    await this._connection.send(data)
  }
}
