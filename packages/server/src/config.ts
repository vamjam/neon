import Conf from 'conf'
import getPort from 'get-port'
import { Config, defaultConfig } from '@shared/config'

const port = await getPort({ port: defaultConfig['server.port'] })

const conf = new Conf<Config>({
  defaults: defaultConfig,
})

conf.set('server.port', port)

export default conf
