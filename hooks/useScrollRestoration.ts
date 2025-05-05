'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export function useScrollRestoration() {
  const pathname = usePathname()

  useEffect(() => {
    const savedY = sessionStorage.getItem(`scrollY:${pathname}`)
    if (savedY) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedY, 10))
        sessionStorage.removeItem(`scrollY:${pathname}`)
      }, 50)
    }
  }, [pathname])
}
