import type Realm from 'realm'
import { UpdateMode } from 'realm'
import connect from '~/db'

class NotConnectedError extends Error {
  constructor() {
    super('Not connected to database')
  }
}

class TimeoutHelper {
  callback: () => unknown
  time: number
  timer: NodeJS.Timeout | null

  constructor(time: number, callback: () => unknown) {
    this.time = time
    this.callback = callback
    this.timer = null

    this.createTimer()
  }

  createTimer() {
    if (this.timer != null) {
      globalThis.clearTimeout(this.timer)
    }

    this.timer = setTimeout(() => {
      this.callback()
    }, this.time)
  }

  ping() {
    this.createTimer()
  }
}

export default class Repository<T> {
  model: string
  db: Realm | null = null
  // timeout: TimeoutHelper

  constructor(model: string) {
    this.model = model
    // this.timeout = new TimeoutHelper(10 * 60 * 1000, () => this.connect())
  }

  async connect() {
    try {
      if (this.db == null) {
        this.db = await connect()
      }

      return this
    } catch (error) {
      console.error(`Unable to connect to db: ${error}`)
    }
  }

  async write(callback: (realm: Realm) => unknown | Promise<unknown>) {
    await this.connect()

    this.db?.write(async () => {
      if (this.db != null) {
        await callback(this.db)
      }
    })
  }

  async create(initialData: T): Promise<T> {
    await this.connect()

    return new Promise((resolve) => {
      this.db?.write(() => {
        this.db?.create<T>(this.model, initialData)

        resolve(initialData)
      }) ?? resolve(initialData)
    })
  }

  async set(data: T): Promise<T | null> {
    await this.connect()

    return new Promise((resolve) => {
      this.db?.write(() => {
        const result =
          this.db?.create<T>(this.model, data, UpdateMode.Modified) ?? null

        resolve(result)
      })
    })
  }

  async get(sortByProp?: keyof T, reverse = false) {
    await this.connect()

    const data = this.db?.objects<T>(this.model)

    if (data != null && sortByProp != null) {
      return data.sorted(sortByProp as string, reverse)
    }

    return data
  }

  async getById(id: Realm.PrimaryKey) {
    await this.connect()

    return this.db?.objectForPrimaryKey<T>(this.model, id)
  }

  async first(sortProp?: keyof T, reverse = false) {
    const data = await this.get(sortProp, reverse)

    return data && data.length > 0 ? data[0] : undefined
  }
}
