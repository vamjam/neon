export const isNullOrEmpty = (val?: unknown): val is undefined | null | '' => {
  return !(
    typeof val === 'string' &&
    val.trim().length > 0 &&
    val.trim() !== ''
  )
}
