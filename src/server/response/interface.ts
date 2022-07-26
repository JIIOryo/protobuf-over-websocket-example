
export interface IResponse<Res extends object = object> {
  reply: (commandName: string, data: Res) => Promise<void>
  broadcast: (data: Res) => Promise<void>
}
