'use client'

import { useEffect } from 'react'
import { SliceMachine } from '~/intergrations/sanity/slices'
import type { Slice } from '~/sanity/types'

export default function ClientPageWrapper({
  slug,
  slices,
}: {
  slug: string
  slices: Slice[]
}) {
  const isWorkPage = slug === 'work'

  // Désactive le scrollRestoration automatique
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  // Sauvegarde du scroll
  useEffect(() => {
    const saveScrollPosition = () => {
      sessionStorage.setItem('scrollY-work', window.scrollY.toString())
    }

    window.addEventListener('beforeunload', saveScrollPosition)
    return () => {
      window.removeEventListener('beforeunload', saveScrollPosition)
    }
  }, [])

  // Restauration du scroll après chargement des vignettes
  useEffect(() => {
    if (!isWorkPage) return

    const saved = sessionStorage.getItem('scrollY-work')
    if (saved) {
      const targetY = parseInt(saved, 10)
      const tryRestore = () => {
        const items = document.querySelectorAll('.scroll-track')
        if (items.length >= 24) {
          window.scrollTo(0, targetY)
          return true
        }
        return false
      }

      let attempts = 0
      const interval = setInterval(() => {
        const ok = tryRestore()
        if (ok || attempts > 40) clearInterval(interval)
        attempts++
      }, 100)
    }
  }, [isWorkPage])

  return <SliceMachine slices={slices} />
}
