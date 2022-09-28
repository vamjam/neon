import { StrictMode } from 'react'
import { Header, Sidebar } from '~/components'

export default function App() {
  return (
    <StrictMode>
      <Header />
      <div>
        <Sidebar />
      </div>
    </StrictMode>
  )
}
