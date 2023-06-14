/**
 * Formats a date into a number.
 * @param date The date
 * @returns The date, formatted as a number (of seconds
 * since Unix epoch)
 */
export const toEntity = (date: Date | undefined | null) => {
  if (!(date instanceof Date)) {
    return null
  }

  return Math.round(date.getTime() / 1000)
}

/**
 * Formats a number into a Date
 * @param date The date as a number
 * @returns instance of Date
 */
export const fromEntity = (date: number | undefined | null) => {
  if (typeof date !== 'number' || date < 1000) {
    return null
  }

  return new Date(date * 1000)
}
