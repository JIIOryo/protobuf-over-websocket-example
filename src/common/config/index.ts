import {Config} from '@common/types'

export const config: Config = {
  server: {
    port: 3000,
    chatUser: {
      timeout: 20 * 1000
    }
  },
  client: {
    pingInterval: 5 * 1000
  }
}
