// import { QueryClientProvider } from 'react-query'
// import { AuthProvider } from '~/components/auth'
// import queryClient from '~/store/queryClient'
// import StyleProvider from '~/style/StyleProvider'
import Terminal from '~/components/terminal/Terminal'

export default function App(): JSX.Element {
  return <Terminal />
  // return (
  //   <QueryClientProvider client={queryClient}>
  //     <AuthProvider>
  //       <StyleProvider>This works</StyleProvider>
  //     </AuthProvider>
  //   </QueryClientProvider>
  // )
}
