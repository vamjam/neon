import styled from 'styled-components'
import { Media, PagedResponse } from '@shared/types'
import { VideoPlayer } from '~/components/video-player'
import useAPI from '~/hooks/useAPI'
import Sidebar from './components/Sidebar'

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

export default function Home() {
  const { data } = useAPI<PagedResponse<Media>>('/api/media/video/1/28')
  const item = data?.records.at(0)

  return (
    <Container>
      <Sidebar />
      {item && (
        <div key={item.id}>
          <h2>{item.title}</h2>
          <VideoPlayer media={item} />
        </div>
      )}
    </Container>
  )
}
