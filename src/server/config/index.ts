import {Config} from '@server/types'

import {config as commonConfig} from '@common'

export const config: Config = {
  server: {
    port: commonConfig.server.port
  }
}
