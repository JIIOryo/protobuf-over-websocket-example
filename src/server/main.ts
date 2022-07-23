import 'reflect-metadata'

import {server} from '@server'

const main = async () => {
  await server.setup()
  await server.start()
}

main()
