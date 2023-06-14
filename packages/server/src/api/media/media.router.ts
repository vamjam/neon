import { RequestHandler, Response, Router } from 'express'
import { MediaType } from '@shared/enums'
import { Media, PagedResponse } from '@shared/types'
import { mediaRepository } from '~/db'
import { id as idMap } from '~/maps'
import { MediaModel } from '~/models'

const media = Router()

const getByIdHandler: RequestHandler<{ id: string }, MediaModel> = async (
  req,
  res: Response<MediaModel>
) => {
  const sid = req.params.id
  const iid = idMap.toEntity(sid) as number
  const entity = await mediaRepository.getMediaById(iid)

  res.json(new MediaModel(entity))
}

media.get('/:id', getByIdHandler)

const getPagedByTypeHandler: RequestHandler<
  { type: MediaType; page: string; count: string },
  PagedResponse<Media>
> = async (req, res, next) => {
  try {
    const { type, page, count } = req.params

    const results = await mediaRepository.getPagedByType(type, {
      count: Number(count),
      page: Number(page),
    })

    const mapped = {
      ...results,
      records: results.records.map((m) => new MediaModel(m).toDTO()),
    }

    res.json(mapped)
  } catch (err) {
    next(err)
  }
}

media.get('/:type/:page/:count', getPagedByTypeHandler)

export default media
