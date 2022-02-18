import chalk from 'chalk'
import winston, { LoggerOptions } from 'winston'
import dirname from './dirname'

const { format, transports } = winston

type LogOptions = {
  filename: string
  label?: string
}

const colorLevel = (level: string) => {
  switch (level) {
    case 'info':
      return chalk.blue(level)
    case 'warn':
      return chalk.yellow(level)
    case 'error':
      return chalk.red(level)
    case 'debug':
      return chalk.cyan(level)
    default:
      return level
  }
}

export const createLogger = ({
  filename,
  label,
}: LogOptions): winston.Logger => {
  const timestamp = format.timestamp({
    format: 'MM.DD.YY hh:mm:ss',
  })

  const printf = format.printf(
    ({ timestamp, label, level, message }) =>
      `${chalk.gray(timestamp)}: ${colorLevel(level)}: ${
        label ? `${chalk.gray(label)}: ` : ''
      }${message}`
  )

  const commonFormats = [timestamp, format.align(), printf]

  if (label != null) {
    commonFormats.push(format.label({ label }))
  }

  const options = {
    console: {
      format: format.combine(format.colorize(), ...commonFormats),
    },
    file: {
      filename,
      format: format.combine(...commonFormats),
    },
  }

  const config: LoggerOptions = {
    transports: [
      new transports.Console(options.console),
      new transports.File(options.file),
    ],
  }

  return winston.createLogger(config)
}

export const logfile = dirname('../.logs/neon.server.log')
// export const adminLoggerFileName = dirname('../.logs/neon.admin.log')

export default createLogger({
  filename: logfile,
  // label: 'neon.service',
})

// export const adminLogger = createLogger({
//   filename: adminLoggerFileName,
//   label: 'neon.admin',
// })

// export default {
//   serviceLogger,
//   adminLogger,
// }
