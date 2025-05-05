'use client'
import cn from 'clsx'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ReactNode, MouseEvent } from 'react'

interface Props {
  children: React.ReactNode
  className?: string
  isExternal?: boolean | null
  url?: string | null
  targetBlank?: boolean | null
  slug?: string | null
}


  // AJOUT YANN
interface TransitionLinkProps {
  slug: string
  children: ReactNode
}
export const TransitionLink = ({ slug, children }: TransitionLinkProps) => {
  const router = useRouter()
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Sauvegarder la position de scroll actuelle
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('scrollY', window.scrollY.toString())
    }
  }
// FIN AJOUT YANN

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
      <Link className={cn(className)} href={`/${slug}`} scroll={false} onClick={handleClick}> 
        {children}
      </Link>
    )
  }
}
