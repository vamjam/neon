import fs from 'node:fs/promises'
import path from 'node:path'
import type { Prisma } from '@prisma/client'
import chalk from 'chalk'
import { XMLParser } from 'fast-xml-parser'
import flatten from 'flat'
// import attempt from '~/utils/attempt'
import log from '@shared/logger'
import { ArtType } from '@shared/types/Art'
import * as NFO from './types'

const logger = log('meta.nfo.parser')
const parser = new XMLParser()

const loadNFO = (file: string) => {
  try {
    const name = path.extname(file)

    return fs.readFile(`${name}.nfo`, 'utf-8')
  } catch {
    return Promise.resolve(null)
  }
}

const readNFO = async (file: string) => {
  const nfo = await loadNFO(file)

  if (nfo != null) {
    try {
      return parser.parse(nfo) as NFO.Root
    } catch (err) {
      logger.error('Error parsing NFO file!', err)
    }
  }
}

// type ArtTypeKeys = Exclude<keyof typeof ArtType, 'prototype'>

// const artTypes = Object.keys(ArtType).map((k) => k.toLowerCase())

const parseArt = (art?: NFO.Art) => {
  return Object.entries(art ?? {})
    .map(([key, value]) => {
      if (typeof value !== 'string') {
        return
      }

      const lc = key.toLowerCase()

      if (artTypes.includes(lc)) {
        return {
          type: ArtType[lc.toUpperCase() as Uppercase<ArtTypeKeys>],
          uri: value,
        }
      }

      logger.warn(`Found unmapped art type: "${chalk.cyan(key)}"`)
    })
    .filter((e) => e != null) as {
    type: ArtType
    uri: string
  }[]
}

const isNumber = (value?: string) => {
  if (value == null || value?.trim() === '') {
    return false
  }

  return !isNaN(parseFloat(value))
}

const dateKeysMap = ['premiered', 'year']

const valueParser = (data?: NFO.Root) => {
  return JSON.parse(JSON.stringify(data), (key, value) => {
    if (typeof value === 'string') {
      switch (value.toLowerCase()) {
        case 'true': {
          return true
        }

        case 'false': {
          return false
        }
      }

      if (key.includes('date') || dateKeysMap.includes(key)) {
        try {
          return new Date(value)
        } catch {
          logger.warn(
            `Tried to parse "${key}" as a date, but "${value}" isn't a valid date.`
          )
        }
      }

      if (isNumber(value)) {
        return Number(value)
      }
    }

    return value
  })
}

const parseNFO = (data?: NFO.Root) => {
  const parsed = JSON.parse(JSON.stringify(data), (key, value) => {
    if (typeof value === 'string') {
      switch (value.toLowerCase()) {
        case 'true': {
          return true
        }

        case 'false': {
          return false
        }
      }

      if (key.includes('date')) {
        try {
          return new Date(value)
        } catch {
          logger.warn(
            `Tried to parse "${key}" as a date, but "${value}" isn't a valid date.`
          )
        }
      }
    }

    if (key === 'art') {
      return parseArt(value)
    }
  }) as NFO.Root

  const media = {} as Pick<
    Prisma.MediaCreateInput,
    'name' | 'art' | 'meta' | 'credits'
  >
  const hasArt =
    parsed.movie != null &&
    Array.isArray(parsed.movie?.art) &&
    parsed.movie.art.length > 0
  const hasActor = parsed.movie != null && parsed.movie?.actor != null
  const hasActors = hasActor && Array.isArray(parsed.movie?.actor)

  if (parsed.movie?.title) {
    media.name = parsed.movie.title
  }

  if (hasArt) {
    // media.art = {
    //   create: parsed?.movie?.art?.?.map?.((a) => ({
    //     type: a.type,
    //     uri: a.uri,
    //     provider: 'neon.nfo',
    //   })),
    // }
  }

  media.meta = flatten(parsed)

  return media
}

// export default async function* parse(...files: string[]) {
//   for await (const file of files) {
//     const data = await readNFO(file)

//     if (data == null) {
//       continue
//     }

//     yield parseNFO(data)
//   }
// }
export default async function parse(file: string) {}
