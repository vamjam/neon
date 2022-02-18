import { Fragment, PropsWithChildren, ReactNode } from 'react'
import { useQuery } from 'react-query'
import { User } from '@neon/base/types'
import Login from '~/pages/Login'

export default function AuthProvider({
  children,
}: PropsWithChildren<ReactNode>): JSX.Element {
  const { data, isSuccess, isLoading } = useQuery<User>('/auth')

  if (isSuccess === true && isLoading === false && data == null) {
    return <Login />
  }

  return <Fragment>{children}</Fragment>
}
