import chalk, { ChalkInstance } from 'chalk'
import * as winston from 'winston'

const FILE_NAME = './logs/neon.log'

const timestamp = winston.format.timestamp({
  format: 'YYYY.MM.DD HH:mm:ss',
})

const levelColorMap = (level: string) => {
  switch (level) {
    case 'error':
      return chalk.red
    case 'warning':
      return chalk.yellow
    case 'info':
      return chalk.blueBright
  }

  return chalk.dim
}

const format = (color = false) => {
  const colorize = (text: string, chalk?: ChalkInstance) =>
    color && chalk instanceof Function ? chalk(text) : text

  return winston.format.printf(
    ({ level, message, label, timestamp, ...meta }) => {
      return `${colorize(timestamp, chalk.gray)} ${colorize(
        `[${label}] ${level}:`,
        levelColorMap(level)
      )} ${message} ${colorize(
        Object.keys(meta).length > 0 ? JSON.stringify(meta, null, 2) : '',
        chalk.dim
      )}`
    }
  )
}

const fileOptions: winston.transports.FileTransportOptions = {
  filename: FILE_NAME,
  level: 'info',
  handleExceptions: true,
  maxsize: 5242880, // 5MB
  maxFiles: 5,
  format: winston.format.combine(timestamp, format(false)),
}

const consoleOptions: winston.transports.ConsoleTransportOptions = {
  level: 'debug',
  handleExceptions: true,
  format: winston.format.combine(
    winston.format.cli(),
    winston.format.align(),
    winston.format.colorize({
      all: true,
    }),
    timestamp,
    format(true)
  ),
}

const logger = winston.createLogger({
  levels: winston.config.npm.levels,
  transports: [
    new winston.transports.File(fileOptions),
    new winston.transports.Console(consoleOptions),
  ],
  exitOnError: false,
})

export const info = (
  namespace: string,
  message: unknown,
  ...args: unknown[]
) => {
  return logger.info({ message, label: namespace, ...args })
}

export const error = (namespace: string, message: unknown, err?: unknown) => {
  return logger.error({
    message,
    label: namespace,
    err: {
      message: (err as Error)?.message ?? 'none',
      stack: (err as Error)?.stack ?? 'none',
    },
  })
}

export const debug = (
  namespace: string,
  message: unknown,
  ...args: unknown[]
) => {
  return logger.debug({ message, label: namespace, ...args })
}

export const warn = (
  namespace: string,
  message: unknown,
  ...args: unknown[]
) => {
  return logger.warn({ message, label: namespace, ...args })
}

export const log = (
  level: string,
  namespace: string,
  message: unknown,
  ...args: unknown[]
) => {
  return logger.log(level, { message, label: namespace, ...args })
}
