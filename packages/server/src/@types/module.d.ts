declare module '*.sql?raw' {
  const sql: string
  export default sql
}

declare module '@ffprobe-installer/ffprobe' {
  export const path: string
}

declare module '*.png' {
  const imagePath: string
  export default imagePath
}
