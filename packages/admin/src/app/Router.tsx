import { Route, Routes } from 'react-router-dom'
import Home from '~/pages/Home'
import Layout from './Layout'

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
      </Route>
    </Routes>
  )
}
