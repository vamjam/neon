import { InputHTMLAttributes } from 'react'
import styled from 'styled-components'

export type TextboxProps = InputHTMLAttributes<HTMLInputElement>

const Textbox = styled.input.attrs<TextboxProps>({
  type: 'text',
})`
  display: block;
  width: 100%;
  box-sizing: border-box;
  border: 3px solid ${({ theme }) => theme.colors.faded};
  padding: 0.5rem;
  font-size: larger;
  background-color: transparent;
  color: currentColor;
  outline: none;
`

export default Textbox
