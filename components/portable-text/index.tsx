import type { FC } from 'react'

import { PortableText } from '@portabletext/react'
import cn from 'clsx'
import type { RichText } from '~/sanity/types'
import s from './portable-text.module.css'

export type PortableTextComponentProps = Omit<RichText, '_type'>

export const LinkComponent = ({
  children,
  className,
}: { children: string; className?: string }) => {
  return (
    <div className={cn(s.link, className)}>
      <span>{children}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        width="1em"
        height="1em"
      >
        <path
          fill="currentColor"
          d="M12.7 244.7L1.4 256l11.3 11.3 168 168L192 446.6 214.6 424l-11.3-11.3L62.6 272 432 272l16 0 0-32-16 0L62.6 240 203.3 99.3 214.6 88 192 65.4 180.7 76.7l-168 168z"
        />
      </svg>
    </div>
  )
}

const components = {
  block: {
    h1: ({ children }: { children: string }) => (
      <h1 className={s.rich_text_h1}>{children}</h1>
    ),
    h2: ({ children }: { children: string }) => (
      <h2 className={s.rich_text_h2}>{children}</h2>
    ),
    h3: ({ children }: { children: string }) => (
      <h3 className="rich_text-h3">{children}</h3>
    ),
    h4: ({ children }: { children: string }) => (
      <h4 className="rich_text-h4">{children}</h4>
    ),
    h5: ({ children }: { children: string }) => (
      <h5 className="rich_text-h5">{children}</h5>
    ),
    'link-large': ({ children }: { children: string }) => (
      <LinkComponent className={s.link_large}>{children}</LinkComponent>
    ),
    'link-small': ({ children }: { children: string }) => (
      <LinkComponent className={s.link_small}>{children}</LinkComponent>
    ),
    strong: ({ children }: { children: string }) => (
      <strong style={{ fontWeight: 'bold' }} className={s.strong}>
        {children}
      </strong>
    ),
    em: ({ children }: { children: string }) => (
      <em style={{ fontStyle: 'italic' }} className={s.em}>
        {children}
      </em>
    ),
  },
  types: {
    code: ({ value }: { value: { code: string; language: string } }) => {
      if (value.language === 'html') {
        const parser = new DOMParser()
        const doc = parser.parseFromString(value.code, 'text/html')
        return doc.body.innerHTML
      }
      return (
        <div
          className={s.code_block}
          dangerouslySetInnerHTML={{ __html: value.code }}
        />
      )
    },
  },
  marks: {
    subtitle: ({ children }: { children: string }) => (
      <span className={s.subtitle}>{children}</span>
    ),
    'text-align-center': ({ children }: { children: string }) => (
      <span className="block text-center">{children}</span>
    ),
    'project-color': ({ children }: { children: string }) => (
      <span style={{ color: 'var(--logo-color)' }} className="project-color">
        {children}
      </span>
    ),
  },
}

export const PortableTextComponent: FC<PortableTextComponentProps> = ({
  content,
}) => {
  if (!content) return null
  return <PortableText value={content} components={components as any} />
}
