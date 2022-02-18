import Realm from 'realm'

export default abstract class BaseEntity<T extends BaseEntity<T>> {
  readonly _id: Realm.BSON.ObjectId
  readonly id: string

  constructor(data: Partial<T> = {}) {
    const { _id, id, ...rest } = data

    this._id = _id ?? new Realm.BSON.ObjectId()
    this.id = this._id.toHexString()

    Object.assign(this, rest)
  }
}
