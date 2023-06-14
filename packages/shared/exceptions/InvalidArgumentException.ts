export default class InvalidArgumentException extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidArgumentException)
    }

    this.name = 'InvalidArgumentException'
  }
}
