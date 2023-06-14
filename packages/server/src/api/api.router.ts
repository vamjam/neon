import { Router } from 'express'
import mediaRouter from './media/media.router'
import videoRouter from './video/video.router'

const api = Router()

api.use('/media', mediaRouter)
api.use('/video', videoRouter)

export default api
