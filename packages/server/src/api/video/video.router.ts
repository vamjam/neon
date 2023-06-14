import { createReadStream } from 'node:fs'
import fs from 'node:fs/promises'
// import { fileURLToPath } from 'node:url'
import { Request, Router } from 'express'
import logger from 'logger'
import { isNullOrEmpty } from '@shared/utils/string'
import { mediaRepository } from '~/db'
// import ffmpeg from '~/ffmpeg'
import { id as idMap } from '~/maps'
import { MediaModel } from '~/models'

const log = logger('api.video.router')

const video = Router()

const CHUNK_SIZE = 1e6

type Range = {
  start: number
  end: number
}

const parseRange = (range = ''): Range => {
  const [start, end] = range
    .replace(/bytes=/, '')
    .split('-')
    .map(Number)

  return {
    start,
    end: end > 0 ? end : CHUNK_SIZE + start,
  }
}

// const play = (
//   source: string,
//   dest: string,
//   start: number,
//   len: number
// ): Promise<void> => {
//   return new Promise((resolve, reject) => {
//     // const readStream = createReadStream(source)
//     const writeStream = createWriteStream(dest)

//     ffmpeg(source)
//       // .seekInput(start)
//       // .setDuration(len)
//       .format('avi')
//       .videoCodec('libx264')
//       .audioCodec('libmp3lame')
//       // .toFormat('mp4')
//       // .withAudioCodec('copy')
//       .on('error', () => {
//         console.log('error?')

//         reject()
//       })
//       .on('stderr', (err) => {
//         console.log('stderr?', err)
//       })
//       .on('end', () => {
//         console.log('end')
//         resolve()
//       })
//       .pipe(writeStream, {
//         end: true,
//       })
//       .on('close', () => {
//         console.log('closed?')

//         resolve()
//       })
//     // .output(res)
//     // .save(dest)
//     // .save(dest)
//     // ffmpeg(source)
//     //   .setStartTime(start)
//     //   .duration(len)
//     //   .videoCodec('libx264')
//     //   .on('error', reject)
//     //   .on('stderr', reject)
//     //   .on('end', resolve)
//     //   // .output(res)
//     //   .save(dest)
//   })
// }

// const play2 = (source: string, dest: Response): Promise<void> => {
//   return new Promise((resolve, reject) => {
//     const chunk = ffmpeg(source)
//       .format('avi')
//       .videoCodec('libx264')
//       .audioCodec('libmp3lame')
//       .on('error', () => {
//         console.log('error?')

//         reject()
//       })
//       .on('stderr', (err) => {
//         console.log('stderr?', err)
//       })
//       .on('end', () => {
//         console.log('end')

//         resolve()
//       })
//       .pipe(dest, {
//         end: true,
//       })
//       .on('close', () => {
//         console.log('closed?')

//         resolve()
//       })
//   })
// }

const getMediaSize = async (media: MediaModel) => {
  if (media.size != null) {
    return media.size
  }

  const stats = await fs.stat(media.fileURL)

  return stats.size
}

const resolveHeaders = async (
  rangeHeader: string | undefined,
  media: MediaModel
) => {
  const size = await getMediaSize(media)

  if (isNullOrEmpty(rangeHeader)) {
    return {
      status: 200,
      'Content-Length': size,
      'Content-Type': 'video/mp4',
    }
  }

  const range = parseRange(rangeHeader)
  const { start } = range
  const end = Math.min(range.end, size - 1)
  const chunkSize = end - start + 1

  if (start >= size || end >= size || end <= start) {
    log.error(`Unsatisfiable range! start=${start}; end=${end};`)

    return {
      status: 416,
      'Content-Range': `bytes */${size}`,
    }
  }

  return {
    status: 206,
    start,
    end,
    'Content-Range': `bytes ${start}-${end}/${size}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': chunkSize,
    'Content-Type': media.mimeType ?? 'video/mp4',
  }
}

video.get('/:id', async (req, res) => {
  const { id } = req.params
  const entityId = idMap.toEntity(id) as number
  const entity = await mediaRepository.getMediaById(entityId)
  const model = new MediaModel(entity)
  const { status, start, end, ...headers } = await resolveHeaders(
    req.header('range'),
    model
  )

  res.writeHead(status, headers)

  if (status === 416 || req.method === 'HEAD') {
    return res.end()
  }

  createReadStream(model.fileURL, {
    start,
    end,
  }).pipe(res)

  // const { size, fileURL } = model

  // if (!size || !Number.isInteger(size)) {
  //   return next(new Error('Unable to determine size of media!'))
  // }

  // const rangeHeader = req.header('range')

  // if (isNullOrEmpty(rangeHeader)) {
  //   res.writeHead(200, {
  //     'Content-Length': size,
  //     'Content-Type': 'video/mp4',
  //   })

  //   createReadStream(model.fileURL).pipe(res)
  // } else {
  //   const range = parseRange(req.header('range'))
  //   const { start } = range
  //   const end = Math.min(range.end, size - 1)
  //   const chunkSize = end - start + 1

  //   if (start >= size || end >= size) {
  //     res.writeHead(416, {
  //       'Content-Range': `bytes */${size}`,
  //     })

  //     return res.end()
  //   }

  //   res.writeHead(206, {
  //     'Content-Range': `bytes ${start}-${end}/${size}`,
  //     'Accept-Ranges': 'bytes',
  //     'Content-Length': chunkSize,
  //     'Content-Type': 'video/mp4',
  //   })

  //   const readStream = createReadStream(model.fileURL, {
  //     start,
  //     end,
  //   })

  //   readStream.pipe(res)
  // }

  // const input = fileURLToPath(fileURL)
  // const output = await model.createTempPath()

  // if (req.method === 'HEAD') {
  //   return res.end()
  // }

  // try {
  //   // const writeStream = createWriteStream(output)

  //   // play(source, res, start, contentLength)
  //   const chunk = ffmpeg(input)
  //     .format('avi')
  //     .videoCodec('libx264')
  //     .audioCodec('libmp3lame')
  //     .setStartTime(start / 1000)
  //     .setDuration(contentLength / 1000)
  //     .on('error', (err, stdout, stderr) => {
  //       console.log('We encountered an error!', err?.message)
  //       console.log('stdout', stdout)

  //       next(err)
  //     })
  //     .on('stderr', (err) => {
  //       console.log('stderr?', err)
  //     })
  //     .on('end', () => {
  //       console.log('end')

  //       res.end()
  //     })
  //     .pipe(res, {
  //       end: true,
  //     })
  //     .on('close', () => {
  //       console.log('closed?')

  //       res.end()
  //     })

  //   res.on('close', () => {
  //     if (!chunk.destroyed) {
  //       chunk.destroy(new Error(`Request was closed...`))

  //       log.info(`ffmpeg was closed`)
  //     }
  //   })

  //   // const readStream = createReadStream(output, {
  //   //   start,
  //   //   end,
  //   // })

  //   // readStream.pipe(res).on('error', next)
  // } catch (err) {
  //   console.error('err!', (err as Error)?.message)

  //   next(err)
  // }

  // res.end()
})

export default video
