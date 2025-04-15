'use client'

import cn from 'clsx'
import type { LenisOptions } from 'lenis'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

import type { Theme } from '~/styles/config'
import { Lenis } from '../lenis'
import { Navigation } from '../navigation'
interface WrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  theme?: Theme
  lenis?: boolean | LenisOptions
  color?: string
}

export function Wrapper({
  children,
  theme = 'dark',
  className,
  lenis = true,
  ...props
}: WrapperProps) {
  const pathname = usePathname()

  // biome-ignore lint/correctness/useExhaustiveDependencies: we need to trigger on path change
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [pathname, theme])

  return (
    <>
      <Navigation />
      <main className={cn('relative flex flex-col grow', className)} {...props}>
        {children}
        <script>
          {`document.documentElement.setAttribute('data-theme', '${theme}');`}
        </script>
      </main>
      {/* <Footer /> */}
      {lenis && <Lenis root options={typeof lenis === 'object' ? lenis : {}} />}
    </>
  )
}
