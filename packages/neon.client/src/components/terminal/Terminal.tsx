import { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { AttachAddon } from 'xterm-addon-attach'
import { FitAddon } from 'xterm-addon-fit'
import { XTerm } from 'xterm-for-react'
import Xterm from 'xterm-for-react/dist/src/XTerm'
import { WS_URL } from '~/config'

export default function Terminal(): JSX.Element {
  const ref = useRef<Xterm | null>(null)
  const fitAddonRef = useRef<FitAddon | null>(null)

  useEffect(() => {
    if (fitAddonRef.current) {
      fitAddonRef.current.fit()
    }
  }, [fitAddonRef.current])

  useEffect(() => {
    const term = ref.current?.terminal

    const ws = new WebSocket(WS_URL)

    fitAddonRef.current = new FitAddon()

    const attachAddon = new AttachAddon(ws, {
      bidirectional: false,
    })

    term?.loadAddon(fitAddonRef.current)
    term?.loadAddon(attachAddon)

    const theme = {
      background: '#000',
      foreground: '#fff',
    }

    if (term?.options) {
      term.options.theme = theme
    }
  }, [])

  return (
    <XTerm
      ref={ref}
      options={{
        disableStdin: true,
        convertEol: true,
        fontSize: 14,
        cursorBlink: false,
      }}
    />
  )
}
