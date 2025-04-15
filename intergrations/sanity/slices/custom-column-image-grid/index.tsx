'use client'
import cn from 'clsx'
import { type FC, useRef } from 'react'
import { Image } from '~/components/image'
import type { CustomColumnImageGrid as ICustomColumnImageGrid } from '~/sanity/types'
import s from './custom-column-image.module.css'
export interface IImage {
  url: string
  alt: string
  asset: {
    altText: string
  }
}
export interface CustomColumnImageGridProps
  extends Pick<ICustomColumnImageGrid, '_type'> {
  images: IImage[]
  width?: number
}

export const CustomColumnImageGrid: FC<CustomColumnImageGridProps> = ({
  images,
  width,
}) => {
  console.log(images)
  const containerRef = useRef<HTMLDivElement>(null)

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
      {images.map((image, index) => (
        <div key={index} className={s.custom_column_images_grid__item}>
          <Image src={image.url} alt={image.asset.altText || ''} />
        </div>
      ))}
    </section>
  )
}
