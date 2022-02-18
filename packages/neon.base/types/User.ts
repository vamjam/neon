import { UserProviderType } from '~/enums'

import Media from './Media'
import Nullable from './Nullable'

export default interface User {
  id: string
  createdAt: Date

  username: string
  salt: string
  hash: string
  providerType: UserProviderType

  displayName?: Nullable<string>
  lastName?: Nullable<string>
  firstName?: Nullable<string>
  middleName?: Nullable<string>
  emails?: Nullable<string[]>
  photo?: Nullable<Media>
}
