import { Fragment } from 'react'
import { useRouteError } from 'react-router-dom'

type RouteError = {
  status?: number
  statusText?: string
  data?: string
  error?: Error
}

export default function Error() {
  const error = useRouteError() as RouteError

  return (
    <Fragment>
      <h1>{error?.status}</h1>
      <h3>{error?.statusText}</h3>
      <p>{error?.data}</p>
    </Fragment>
  )
}
