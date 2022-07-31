/**
 * serialize/deserialize interface
 */
export interface ISerializer<T extends {[N in string]: object}> {
  /**
   * メッセージをシリアライズする
   * @param name name of the message
   * @param message message to serialize
   * @return serialized message
   */
  serialize<U extends keyof T>(name: U, message: T[U]): any
  /**
   * メッセージをデシリアライズする
   * @param name name of the message
   * @param message message to deserialize
   * @return deserialized message
   */
  deserialize<U extends keyof T>(name: U, message: any): T[U]
}
