'use client'
import cn from 'clsx'
import type { FC } from 'react'
import {
  PortableTextComponent,
  type PortableTextComponentProps,
} from '~/components/portable-text'
import type { TwoColumnTextImage as ITwoColumnTextImage } from '~/sanity/types'
import s from './two-column-text-image.module.css'
export interface TwoColumnTextImageProps
  extends Pick<ITwoColumnTextImage, '_type'> {
  leftSlot: {
    contentType?: 'text' | 'image'
    text?: {
      content?: PortableTextComponentProps['content']
    }
    image?: {
      asset?: {
        url: string
        alt: string
        altText: string
      }
    }
  }
  rightSlot: {
    contentType?: 'text' | 'image'
    text?: {
      content?: PortableTextComponentProps['content']
    }
    image?: {
      asset?: {
        url: string
        alt: string
        altText: string
      }
    }
  }
}

export const TwoColumnTextImage: FC<TwoColumnTextImageProps> = ({
  leftSlot,
  rightSlot,
}) => {
  if (!leftSlot || !rightSlot) return null

  // Create arrays to render content in specific order for mobile
  const slots = [
    {
      contentType: leftSlot.contentType,
      content: leftSlot,
      className: s.two_column_text_image__left,
    },
    {
      contentType: rightSlot.contentType,
      content: rightSlot,
      className: s.two_column_text_image__right,
    },
  ]

  // Filter for text (to display first on mobile)
  const textSlots = slots.filter((slot) => slot.contentType === 'text')
  // Filter for images (to display after text on mobile)
  const imageSlots = slots.filter((slot) => slot.contentType === 'image')

  return (
    <section
      className={cn(
        s.two_column_text_image,
        'bg-primary p-safe text-secondary'
      )}
    >
      {/* Desktop view - render normally */}
      <div className={cn(s.desktop_view)}>
        <div
          className={cn(
            s.two_column_text_image__left,
            leftSlot.contentType === 'image' && 'flex justify-start'
          )}
        >
          {leftSlot.contentType === 'text' && (
            <div className={s.text_wrapper}>
              <PortableTextComponent content={leftSlot.text?.content} />
            </div>
          )}
          {leftSlot.contentType === 'image' && leftSlot.image?.asset?.url && (
            <img
              className="dr-w-full dr-h-full object-cover"
              src={leftSlot.image.asset.url}
              alt={leftSlot.image.asset.altText || ''}
            />
          )}
        </div>
        <div
          className={cn(
            s.two_column_text_image__right,
            rightSlot.contentType === 'image' && 'flex justify-end'
          )}
        >
          {rightSlot.contentType === 'text' && (
            <div className={s.text_wrapper}>
              <PortableTextComponent content={rightSlot.text?.content} />
            </div>
          )}
          {rightSlot.contentType === 'image' && rightSlot.image?.asset?.url && (
            <img
              className="dr-w-full dr-h-full object-cover"
              src={rightSlot.image.asset.url}
              alt={rightSlot.image.asset.altText || ''}
            />
          )}
        </div>
      </div>

      {/* Mobile view - text first, then images */}
      <div className={cn(s.mobile_view)}>
        {/* Render text slots first */}
        {textSlots.map((slot, index) => (
          <div key={`text-${index}`} className={slot.className}>
            <div className={s.text_wrapper}>
              <PortableTextComponent content={slot.content.text?.content} />
            </div>
          </div>
        ))}

        {/* Render image slots after */}
        {imageSlots.map((slot, index) => (
          <div key={`image-${index}`} className={slot.className}>
            {slot.content.image?.asset?.url && (
              <img
                className="dr-w-full dr-h-full object-cover"
                src={slot.content.image.asset.url}
                alt={slot.content.image.asset.altText || ''}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
