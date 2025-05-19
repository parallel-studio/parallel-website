'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { saveScrollPosition, restoreScrollWhenReady } from '~/hooks/scroll'
import { SliceMachine } from '~/intergrations/sanity/slices'
import type { Slice } from '~/sanity/types'

export default function ClientPageWrapper({
  slug,
  slices,
}: {
  slug: string
  slices: Slice[]
}) {
  const router = useRouter()
  const pathname = usePathname()

  const isWorkPage = slug === 'work'

  useEffect(() => {
    if (!isWorkPage) return

    const handleRouteChangeStart = () => saveScrollPosition('work')
    window.addEventListener('beforeunload', () => saveScrollPosition('work'))
    router.events?.on?.('routeChangeStart', handleRouteChangeStart)

    restoreScrollWhenReady('work', () => {
      const items = document.querySelectorAll('.scroll-track')
      return items.length >= 24
    })

    return () => {
      router.events?.off?.('routeChangeStart', handleRouteChangeStart)
    }
  }, [isWorkPage])

  return <SliceMachine slices={slices} />
}
