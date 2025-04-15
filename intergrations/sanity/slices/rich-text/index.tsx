'use client'
import cn from 'clsx'
import type { FC } from 'react'
import { PortableTextComponent } from '~/components/portable-text'
import type { RichText as RichTextProps } from '~/sanity/types'
import s from './rich-text.module.css'

export const RichText: FC<RichTextProps> = ({ content }) => {
  if (!content) return null

  return (
    <div className={cn(s.rich_text, 'bg-primary text-secondary')}>
      <PortableTextComponent content={content} />
    </div>
  )
}
