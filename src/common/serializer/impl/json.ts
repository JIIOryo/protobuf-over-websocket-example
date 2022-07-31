import {ISerializer} from '../interface'

export class JsonSerializer<T extends {[N in string]: object}> implements ISerializer<T> {
  serialize<U extends keyof T>(_name: U, message: T[U]): string {
    return JSON.stringify(message)
  }
  deserialize<U extends keyof T>(_name: U, message: string): T[U] {
    return JSON.parse(message)
  }
}
