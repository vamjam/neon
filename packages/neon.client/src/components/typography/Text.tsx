import { HTMLAttributes, PropsWithChildren, forwardRef } from 'react'
import styled from 'styled-components'

export type TextProps = PropsWithChildren<HTMLAttributes<HTMLElement>> & {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'div'
  inline?: boolean
  mono?: boolean
  ref?: React.ForwardedRef<HTMLElement | undefined>
}

const Wrapper = styled.span<TextProps>`
  display: ${({ inline }) => (inline ? 'initial' : 'block')};
  line-height: 1.33em;
  font-family: ${({ mono, theme }) => (mono ? theme.fonts.mono : 'inherit')};
`

const Text: React.FC<TextProps> = forwardRef((props, ref) => (
  // @ts-ignore - Fuck forwarded ref types
  <Wrapper {...props} ref={ref as any} />
))

Text.displayName = 'Text'

export default Text

export const Headline = styled(Text).attrs({
  as: 'h1',
})`
  font-size: 6rem;
`

export const SubHeadline = styled(Text).attrs({
  as: 'h2',
})`
  font-size: 5rem;
`

export const Title = styled(Text)`
  font-size: 3rem;
`

export const LargeText = styled(Text)`
  font-size: 1.5rem;
`

export const SmallText = styled(Text)`
  font-size: small;
  letter-spacing: 0.1rem;
`

export const InlineText = styled(Text)`
  display: inline;
`

export const MutedText = styled(Text)`
  opacity: 0.5;
`

export const StrongText = styled(Text)`
  font-weight: bold;
`

export const EmphasizedText = styled(Text)`
  font-style: italic;
`
