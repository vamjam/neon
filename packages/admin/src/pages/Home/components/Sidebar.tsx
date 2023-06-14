import { ReactNode } from 'react'
import styled from 'styled-components'
import Navlink from './Navlink'

const NavList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`

const Nav = ({ children }: { children: ReactNode }) => {
  return (
    <nav>
      <NavList>{children}</NavList>
    </nav>
  )
}

export default function Sidebar() {
  return (
    <Nav>
      <Navlink to="/movies">Movies</Navlink>
      <Navlink to="/music">Music</Navlink>
      <Navlink to="/photos">Photos</Navlink>
    </Nav>
  )
}
