import chalk from 'chalk'
import express from 'express'
import root from '@shared/utils/root'
import config from '~/config'

const PORT = config.get('server.port')

const app = express()

app.use('/healthcheck', (_, res) => res.send('Ok'))

app.use('*', express.static(root('../admin/dist'), { maxAge: '30d' }))

app.listen(PORT, () => {
  console.log(
    `\n${chalk.cyan('Server listening on')} ${chalk.green(
      `http://localhost:${PORT}`
    )}\n`
  )
})
