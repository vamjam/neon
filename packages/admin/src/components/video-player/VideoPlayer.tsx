import { MediaCommunitySkin, MediaOutlet, MediaPlayer } from '@vidstack/react'
import 'vidstack/styles/community-skin/video.css'
import 'vidstack/styles/defaults.css'
import { Media } from '@shared/types'

type Props = {
  media: Media
}

export default function VideoPlayer({ media }: Props) {
  return (
    <MediaPlayer
      title={media.title ?? undefined}
      src={media.url}
      aspect-ratio={16 / 9}
      crossorigin="">
      <MediaOutlet>
        <source src={media.url} type={media.mimeType ?? undefined} />
      </MediaOutlet>
      <MediaCommunitySkin />
    </MediaPlayer>
  )
}
