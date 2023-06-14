import client from './client'

export default function repository<T extends object>(tableName: string) {
  return class Repository {
    get client() {
      return client<T>(tableName)
    }

    getTable<TN extends object>(tableName: string) {
      return client<TN>(tableName)
    }
  }
}
