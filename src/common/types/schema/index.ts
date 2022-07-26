
export * as Room from './room'

export type Request<T = any> = {
  commandName: string
  data: T
}
export type Response<T = any> = {
  commandName: string
  data: T
}
