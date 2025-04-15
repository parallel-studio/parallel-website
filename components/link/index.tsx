'use client'
import cn from 'clsx'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

interface Props {
  children: React.ReactNode
  className?: string
  isExternal?: boolean | null
  url?: string | null
  targetBlank?: boolean | null
  slug?: string | null
}

export const TransitionLink = ({
  children,
  className,
  isExternal,
  url,
  targetBlank,
  slug,
}: Props) => {
  const router = useRouter()
  const pathname = usePathname()

  if (isExternal && url) {
    return (
      <a
        className={cn(className)}
        href={url}
        target={targetBlank ? '_blank' : '_self'}
        rel={targetBlank ? 'noopener noreferrer' : ''}
      >
        {children}
      </a>
    )
  }

  if (slug) {
    return (
      <Link className={cn(className)} href={`/${slug}`}>
        {children}
      </Link>
    )
  }
}
