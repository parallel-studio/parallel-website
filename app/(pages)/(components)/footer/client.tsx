'use client'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { useLenis } from 'lenis/react'
import type React from 'react'
import { useRef } from 'react'

type FooterParallaxClientProps = {
  children: React.ReactNode
}

export function FooterParallaxClient({ children }: FooterParallaxClientProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)

  const lenis = useLenis()

  useGSAP(() => {
    if (!lenis || !wrapperRef.current) return
    const layout = document.getElementById('layout')
    const footer = document.getElementById('footer')
    const layoutHeight = layout?.getBoundingClientRect().height
    const wrapperHeight = footer?.getBoundingClientRect().height
    const pageHeight = document.documentElement.getBoundingClientRect().height
    if (!layoutHeight || !wrapperHeight) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        wrapperRef.current,
        { y: -50 },
        {
          y: 0,
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: `${layoutHeight - wrapperHeight * 1.2}px 60%`,
            end: `${layoutHeight - wrapperHeight / 1.2}px 60%`,
            scrub: true,
          },
        }
      )
    }, wrapperRef)

    return () => {
      ctx.revert()
    }
  }, [lenis, wrapperRef])

  return <div ref={wrapperRef}>{children}</div>
}
