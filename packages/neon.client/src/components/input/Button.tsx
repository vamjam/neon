import { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react'
import styled from 'styled-components'

const Container = styled.button`
  display: block;
  text-transform: uppercase;
`

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
}

export default function Button({
  children,
  type = 'button',
  ...props
}: ButtonProps): JSX.Element {
  return (
    <Container type={type} {...props}>
      {children}
    </Container>
  )
}
