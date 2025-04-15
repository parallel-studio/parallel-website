'use client'

import cn from 'clsx'
import { usePathname } from 'next/navigation'
import { TransitionLink } from '~/components/link'
import { useSanityContext } from '~/intergrations/sanity/context'
import { HeaderLogo } from './header-logo'
import s from './navigation.module.css'
export function Navigation() {
  const pathname = usePathname()
  const { data } = useSanityContext()

  const headerData = data.header
  const navigationLinks = headerData.links

  return (
    <nav className={cn(s.nav, 'dr-h-60')} id="nav">
      <div>
        <TransitionLink slug="/">
          <HeaderLogo />
        </TransitionLink>
      </div>

      <ul className={s.list}>
        {navigationLinks.map((link, index) => {
          const isActive = pathname.includes(link.slug)
          return (
            <li key={index}>
              <TransitionLink
                className={cn(
                  isActive ? 'link-underline__active' : null,
                  'link_underline'
                )}
                {...link}
              >
                {link.title}
              </TransitionLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
