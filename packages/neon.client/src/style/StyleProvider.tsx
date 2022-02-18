import { Fragment, ReactNode } from 'react'
import {
  StyleSheetManager,
  ThemeProvider,
  createGlobalStyle,
} from 'styled-components'
import reset from 'styled-reset'

import { darkTheme } from './theme'

const GlobalStyle = createGlobalStyle`
  ${reset}

  body {
    background-color: #23232e;
    color: ${({ theme }) => theme.colors.foreground};
    font-family: 'DM Sans', sans-serif;
    font-size: 18px;
    font-weight: 400;
    -webkit-font-smoothing: antialiased;
  }
`

export default function StyleProvider({
  children,
}: {
  children: ReactNode
}): JSX.Element {
  return (
    <ThemeProvider theme={darkTheme}>
      <StyleSheetManager disableVendorPrefixes>
        <Fragment>
          <GlobalStyle />
          {children}
        </Fragment>
      </StyleSheetManager>
    </ThemeProvider>
  )
}
