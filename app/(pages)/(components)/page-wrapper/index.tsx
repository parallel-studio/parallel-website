'use client'
import gsap from 'gsap'
import { useEffect } from 'react'

export const PageWrapper = ({
  children,
  color,
}: { children: React.ReactNode; color?: string }) => {
  useEffect(() => {
    gsap.to('html', {
      '--logo-color': color || 'black',
      duration: 0.8,
      ease: 'power1.in',
    })
  }, [color])
  return <div>{children}</div>
}
