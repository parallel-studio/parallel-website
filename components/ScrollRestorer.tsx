'use client'

import { useEffect } from 'react'

export function ScrollRestorer() {
  useEffect(() => {
    const savedY = sessionStorage.getItem('scrollY')
    if (savedY) {
      requestAnimationFrame(() => {
        window.scrollTo(0, parseInt(savedY, 10))
        sessionStorage.removeItem('scrollY')
      })
    }
  }, [])

  return null
}
