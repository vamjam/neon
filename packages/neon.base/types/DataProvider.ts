import { DataProviderSource } from '~/enums'

export default interface DataProvider {
  id: string
  source: DataProviderSource
  providerId: string
}
