import { HTMLAttributes, ReactNode } from 'react'
import { Link, LinkProps } from 'react-router-dom'

type NavlinkProps = HTMLAttributes<HTMLLIElement> &
  LinkProps & {
    children: ReactNode
  }

export default function Navlink({ children, to, ...props }: NavlinkProps) {
  return (
    <li {...props}>
      <Link to={to}>{children}</Link>
    </li>
  )
}
