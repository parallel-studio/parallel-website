'use client'
import cn from 'clsx'
import Image from 'next/image'
import { type FC, useState } from 'react'
import { ModalPlayer } from '~/components/modal-player'
import type { FullWidthVideo as IFullWidthVideo } from '~/sanity/types'
import s from './full-width-video.module.css'
export interface FullWidthVideoProps
  extends Pick<IFullWidthVideo, '_type' | 'muxPlaceholderTimestamp'> {
  video: {
    asset: {
      playbackId: string
      data: {
        aspect_ratio: string
      }
    }
  }
}

export const FullWidthVideo: FC<FullWidthVideoProps> = ({
  video,
  muxPlaceholderTimestamp,
}) => {
  const [showModal, setShowModal] = useState(false)

  if (!video) return null
  const videoId = video?.asset?.playbackId ?? null
  const aspectRatio = video?.asset?.data?.aspect_ratio.replace(':', '/')

  const handleCloseModal = () => {
    setShowModal(false)
  }

  return (
    <div className={cn(s.full_width_video, 'bg-primary m-safe text-secondary')}>
      <div
        className={s.full_width_video__wrapper}
        style={{ aspectRatio: aspectRatio }}
      >
        <Image
          fill
          src={`https://image.mux.com/${videoId}/thumbnail.png?time=${muxPlaceholderTimestamp ?? 0}`}
          alt={''}
          className={s.full_width_video__image}
        />
        <div
          className={s.full_width_video__play_button}
          onClick={() => setShowModal(true)}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="m6.73 20.93 14.05-8.54a.46.46 0 0 0 0-.78L6.73 3.07a.48.48 0 0 0-.73.39v17.07a.48.48 0 0 0 .73.4Z"></path>
          </svg>
        </div>
      </div>

      {showModal && (
        <ModalPlayer
          videoId={videoId}
          color={'black'}
          onClose={handleCloseModal}
          aspectRatio={video.asset?.data?.aspect_ratio}
        />
      )}
    </div>
  )
}
