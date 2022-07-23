import 'reflect-metadata'

import {server} from '.'

const main = async () => {
  await server.setup()
  await server.start()
}

main()
