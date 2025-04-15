'use client'
import cn from 'clsx'
import dynamic from 'next/dynamic'
import { type FC, useRef } from 'react'
import { Image } from '~/components/image'
import type { CustomColumnMediaGrid as ICustomColumnMediaGrid } from '~/sanity/types'
import s from './custom-column-media.module.css'
const MuxPlayer = dynamic(() => import('@mux/mux-video-react'), { ssr: false })

export interface IMedia {
  _type: 'image' | 'object'
  // Pour les images
  url?: string
  alt?: string
  asset?: {
    altText: string
  }
  // Pour les vidéos
  video?: {
    playbackId: string
    assetId: string
    filename: string
    aspect_ratio: string
    asset: {
      altText: string
      playbackId: string
    }
  }
  autoplay?: boolean
}

export interface CustomColumnMediaGridProps
  extends Pick<ICustomColumnMediaGrid, '_type'> {
  media: IMedia[]
  width?: number
}

export const CustomColumnMediaGrid: FC<CustomColumnMediaGridProps> = ({
  media,
  width,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  console.log('media', media)
  return (
    <section
      className={cn(
        s.custom_column_images_grid,
        'p-safe gap-safe bg-primary text-secondary'
      )}
      ref={containerRef}
      style={
        width
          ? ({
              '--grid-width': `${width}%`,
            } as React.CSSProperties)
          : undefined
      }
    >
      {media.map((media, index) => (
        <div key={index} className={s.custom_column_images_grid__item}>
          {media._type === 'image' ? (
            <Image
              src={media.url || ''}
              alt={media.alt || media.asset?.altText || ''}
              className="w-full h-auto object-contain"
              style={{ margin: '0 auto' }}
            />
          ) : (
            <MuxPlayer
              className={cn(s.sliderItem__muxPlayer, 'mobile:w-screen', {
                [s.autoplayMode]: media.autoplay,
              })}
              streamType="on-demand"
              playbackId={media.video?.asset?.playbackId || ''}
              loop
              muted
              playsInline
              preload="auto"
              preferPlayback="mse"
              maxResolution="1080p"
              minResolution="1080p"
              autoPlay={media.autoplay || false}
              controls={!media.autoplay}
              metadata={{
                video_title: `Project ${index}`,
                player_name: 'Project Slider',
                player_init_time: new Date().toString(),
                viewer_user_agent:
                  typeof navigator !== 'undefined' ? navigator.userAgent : '',
              }}
            />
          )}
        </div>
      ))}
    </section>
  )
}
