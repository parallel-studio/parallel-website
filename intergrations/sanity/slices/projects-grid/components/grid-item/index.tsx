'use client'
import cn from 'clsx'
import gsap from 'gsap'
import dynamic from 'next/dynamic'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { TransitionLink } from '~/components/link'
import s from './grid-item.module.css'

const MuxPlayer = dynamic(() => import('@mux/mux-video-react'), { ssr: false })

const loadedVideosCache = new Set<string>()

export const GridItem = memo(
  ({
    index,
    slug,
    video,
    color,
    muxPlaceholderTimestamp,
    className,
    style,
    title,
    description,
    onVideoLoaded,
    autoPlay = false,
    lazyLoad = true,
  }: {
    style?: React.CSSProperties
    index: number
    slug: string
    video: string
    color: string
    muxPlaceholderTimestamp: string
    className: string
    title: string
    description: string
    onVideoLoaded?: () => void
    autoPlay?: boolean
    lazyLoad?: boolean
  }) => {
    const itemRef = useRef<HTMLDivElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const videoLoadAttempted = useRef(false)

    const [isVisible, setIsVisible] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)
    const [hasStartedLoading, setHasStartedLoading] = useState(false)
    const [isHovering, setIsHovering] = useState(false)
    const [isSafariDesktop, setIsSafariDesktop] = useState(false)

    const videoId = `${video}-${index}`

    useEffect(() => {
      if (typeof window !== 'undefined') {
        const isSafari = /^((?!chrome|android).)*safari/i.test(
          navigator.userAgent
        )
        const isDesktop = window.innerWidth > 768
        setIsSafariDesktop(isSafari && isDesktop)
      }
    }, [])

    useEffect(() => {
      if (loadedVideosCache.has(videoId)) {
        videoLoadAttempted.current = true
      }
    }, [videoId])

    const muxPlaceholderTimestampParsed = muxPlaceholderTimestamp
      ? Number.parseFloat(muxPlaceholderTimestamp)
      : 0

    useEffect(() => {
      if (!lazyLoad || videoLoadAttempted.current) {
        setIsVisible(true)
        setHasStartedLoading(true)
        return
      }

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !videoLoadAttempted.current) {
            setIsVisible(true)
            setHasStartedLoading(true)
            videoLoadAttempted.current = true

            loadedVideosCache.add(videoId)

            observer.disconnect()
          }
        },
        {
          threshold: 0.1,
          rootMargin: '300px',
        }
      )

      if (itemRef.current) {
        observer.observe(itemRef.current)
      }

      return () => observer.disconnect()
    }, [lazyLoad, videoId])

    const resetVideoPosition = useCallback(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = muxPlaceholderTimestampParsed || 0
      }
    }, [muxPlaceholderTimestampParsed])

    useEffect(() => {
      if (!videoRef.current || !isLoaded) return

      if (!isHovering && !autoPlay) {
        resetVideoPosition()
      }
    }, [isLoaded, isHovering, autoPlay, resetVideoPosition])

    useEffect(() => {
      if (!videoRef.current || !isVisible || !isLoaded) return

      if (autoPlay) {
        try {
          const player = videoRef.current as any
          if (player._hls) {
            player._hls.config.maxBufferLength = 30
            player._hls.config.maxMaxBufferLength = 60
          }
        } catch (error) {
          console.warn('Impossible de configurer le buffer HLS:', error)
        }

        videoRef.current
          .play()
          .catch((err) => console.warn('Lecture automatique impossible:', err))
      } else if (!isHovering) {
        videoRef.current.pause()
        resetVideoPosition()
      }
    }, [autoPlay, isVisible, isLoaded, isHovering, resetVideoPosition])

    const handleMouseEnter = useCallback(() => {
      if (!videoRef.current || !isLoaded) return

      setIsHovering(true)

      gsap.set('html', { '--active-index': String(index) })
      gsap.to('html', {
        '--logo-color': color,
        duration: 0.5,
        ease: 'power1.in',
      })

      try {
        const player = videoRef.current as any
        if (player._hls) {
          player._hls.config.maxBufferLength = 30
          player._hls.config.maxMaxBufferLength = 60
        }
      } catch (error) {
        console.warn('Impossible de configurer le buffer HLS:', error)
      }

      videoRef.current.play().catch((err) => {
        console.warn('Lecture au survol impossible:', err)
      })
    }, [isLoaded, index, color])

    const handleMouseLeave = useCallback(() => {
      if (!videoRef.current || !isLoaded) return

      setIsHovering(false)

      gsap.to('html', { '--logo-color': '#000000' })

      videoRef.current.pause()

      requestAnimationFrame(() => {
        resetVideoPosition()
      })
    }, [isLoaded, resetVideoPosition])

    const handleLoadedData = useCallback(() => {
      if (videoRef.current) {
        try {
          const player = videoRef.current as any
          if (player._hls) {
            player._hls.config.maxBufferLength = 30
            player._hls.config.maxMaxBufferLength = 60
          }
        } catch (error) {
          console.warn('Impossible de configurer le buffer HLS:', error)
        }

        resetVideoPosition()
      }

      setIsLoaded(true)
      gsap.to(itemRef.current, { opacity: 1, duration: 0.5, ease: 'power1.in' })

      onVideoLoaded?.()
    }, [resetVideoPosition, onVideoLoaded])

    // AJOUT YANN 
    const pathname = window.location.pathname
    sessionStorage.setItem(`scrollY:${pathname}`, String(window.scrollY))
    



    if (!isVisible && !hasStartedLoading) {
      return (
        <div
          ref={itemRef}
          className={cn(s.grid_item, className)}
          style={{ ...style, opacity: 0 }}
        />
      )
    }

    return (
      <div ref={itemRef} className={cn(s.grid_item, className)} style={style}>
        <TransitionLink slug={`work/${slug}`}>
          <div
            className={s.grid_item__video}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <MuxPlayer
              className={s.muxPlayer}
              ref={videoRef}
              streamType="on-demand"
              playbackId={video}
              loop={true}
              muted={true}
              playsInline
              preload={lazyLoad ? 'metadata' : 'auto'}
              preferPlayback="mse"
              minResolution="720p"
              maxResolution="720p"
              {...(isSafariDesktop
                ? { onLoadedData: handleLoadedData }
                : { onLoadedMetadata: handleLoadedData })}
              startTime={muxPlaceholderTimestampParsed}
              poster={`https://image.mux.com/${video}/thumbnail.webp?height=720&time=${muxPlaceholderTimestampParsed}`}
              style={{
                height: '100%',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            />
          </div>
          <div className={s.grid_item__infos}>
            <h2 className={s.grid_item__infos__title}>
              <span style={{ color }}>{title}</span> {description}
            </h2>
          </div>
        </TransitionLink>
      </div>
    )
  }
)

GridItem.displayName = 'GridItem'
