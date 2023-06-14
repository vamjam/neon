import util from 'node:util'
import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg'
import { path as ffprobePath } from '@ffprobe-installer/ffprobe'
import ffmpeg from 'fluent-ffmpeg'

ffmpeg.setFfmpegPath(ffmpegPath)
ffmpeg.setFfprobePath(ffprobePath)

export default ffmpeg

export const ffprobe = util.promisify<string, ffmpeg.FfprobeData | undefined>(
  ffmpeg.ffprobe
)
