import Realm from 'realm'
import * as Entity from './entities'

const ref: { current: null | Realm } = Object.seal({
  current: null,
})

export const createObjectId = (): Realm.BSON.ObjectId => {
  return new Realm.BSON.ObjectId()
}

export default async function connect(): Promise<Realm> {
  try {
    if (ref.current == null || ref.current?.isClosed) {
      ref.current = await Realm.open({
        path: './.data/neon.realm',
        schema: Object.values(Entity),
      })
    }
  } catch (err) {
    console.error(`Unable to connect: ${(err as Error)?.message}`)
  } finally {
    return ref.current as Realm
  }
}
