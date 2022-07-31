import * as protobuf from 'protobufjs'

import {ISerializer} from '../interface'

export class ProtobufSerializer<T extends {[N in string]: object}> implements ISerializer<T> {
  private _root: protobuf.Root

  /**
   * @param protoPaths protoファイルのパス一覧
   */
  constructor(protoPaths: string[]) {
    this._root = new protobuf.Root()
    protoPaths.forEach(path => this._root.loadSync(path))
  }

  serialize<U extends keyof T>(name: U, message: T[U]): Uint8Array {
    return this._root.lookupType(name as string).encode(message).finish()
  }

  deserialize<U extends keyof T>(name: U, message: Uint8Array): T[U] {
    const result = this._root.lookupType(name as string).decode(message)
    // @ts-expect-error T[U]型に変換
    return this._root.lookupType(name as string).toObject(result, {defaults: true})
  }
}
