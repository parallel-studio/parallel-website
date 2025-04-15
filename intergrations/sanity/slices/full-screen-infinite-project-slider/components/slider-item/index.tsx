'use client'

import cn from 'clsx'
import gsap from 'gsap'
import { useTransitionRouter } from 'next-view-transitions'
import dynamic from 'next/dynamic'
import { forwardRef, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { TransitionLink } from '~/components/link'
import { ModalPlayer } from '~/components/modal-player'
import { useSliderDimensions } from '../../hooks/use-slider-dimensions'
import { useVideoPlayer } from '../../hooks/use-video-player'
import type { IProjectParallel } from '../../index'
import { useSliderStore } from '../../store/use-slider-store'
import s from './slider-item.module.css'
const MuxPlayer = dynamic(() => import('@mux/mux-video-react'), { ssr: false })

interface SliderItemProps {
  project: IProjectParallel
  index: number
  onMetadataLoaded: (index: number, event: any) => void
  containerHeight?: number
  className?: string
  onMouseEnterSlider?: () => void
  onMouseLeaveSlider?: () => void
  isScrolling?: boolean
}

export const SliderItem = forwardRef<HTMLDivElement, SliderItemProps>(
  (
    {
      project,
      index,
      onMetadataLoaded,
      containerHeight,
      className = '',
      onMouseEnterSlider,
      onMouseLeaveSlider,
    },
    ref
  ) => {
    console.log('project ->', project.video)
    const router = useTransitionRouter()
    const timestamp = Number.parseInt(project.muxPlaceholderTimestamp) || 0
    const playbackIdRef =
      project.Videos?.[project.video || 'video_short']?.asset?.playbackId || ''
    const isVisibleRef = useRef(true)
    const wasHoveredRef = useRef(false)
    const [showModal, setShowModal] = useState(false)
    const [isSafariDesktop, setIsSafariDesktop] = useState(false)

    const { hoveredIndex, setHoveredIndex, mousePosition } = useSliderStore()
    const isDimmed = hoveredIndex !== null && hoveredIndex !== index

    const { itemRef, setAspectRatio } = useSliderDimensions({ containerHeight })

    const {
      videoRef,
      handleMouseEnter: baseHandleMouseEnter,
      handleMouseLeave: baseHandleMouseLeave,
    } = useVideoPlayer({
      timestamp,
      onMetadataLoaded,
      index,
      projectColor: project.color?.value || 'white',
      onMouseEnterSlider,
      onMouseLeaveSlider,
    })

    // Vérifier le navigateur au chargement du composant
    useEffect(() => {
      if (typeof window !== 'undefined') {
        const isSafari = /^((?!chrome|android).)*safari/i.test(
          navigator.userAgent
        )
        const isDesktop = window.innerWidth > 768
        setIsSafariDesktop(isSafari && isDesktop)
      }
    }, [])

    // Vérifier si la souris est au-dessus de l'élément
    const checkMouseOver = () => {
      if (!itemRef.current || !mousePosition) return false

      const element = itemRef.current
      const rect = element.getBoundingClientRect()

      // Obtenir la position X avec GSAP
      const x = gsap.getProperty(element, 'x') as number

      // Calculer la position réelle
      const realLeft = rect.left + x
      const realRight = realLeft + rect.width

      return (
        mousePosition.x >= realLeft &&
        mousePosition.x <= realRight &&
        mousePosition.y >= rect.top &&
        mousePosition.y <= rect.bottom
      )
    }

    // Effet pour gérer le hover pendant la navigation normale
    useEffect(() => {
      if (!mousePosition) return

      const isMouseOver = checkMouseOver()

      if (isMouseOver && !wasHoveredRef.current) {
        wasHoveredRef.current = true
        handleMouseEnter()
      } else if (!isMouseOver && wasHoveredRef.current) {
        wasHoveredRef.current = false
        handleMouseLeave()
      }
    }, [mousePosition])

    // Effet pour appliquer une transition d'opacité spécifique pour Safari desktop
    useEffect(() => {
      if (!itemRef.current) return

      // Gestion spéciale pour Safari desktop
      if (isSafariDesktop) {
        // Utiliser visibility:hidden pour éviter le flash initial
        gsap.set(itemRef.current, {
          visibility: 'hidden',
          opacity: 0,
        })
      }
    }, [isSafariDesktop])

    // Effet pour s'assurer que la vidéo commence à lire quand cet élément est survolé
    useEffect(() => {
      if (hoveredIndex === index) {
        if (videoRef.current) {
          // Configuration du buffer pour améliorer la qualité initiale
          try {
            const player = videoRef.current as any
            if (player._hls) {
              player._hls.config.maxBufferLength = 30
              player._hls.config.maxMaxBufferLength = 60
            }
          } catch (error) {
            console.warn('Impossible de configurer le buffer HLS:', error)
          }

          videoRef.current.play().catch((err: Error) => {
            console.warn('Lecture vidéo impossible:', err)
          })
        }

        // Si cet élément est survolé, mais que wasHoveredRef est false, le synchroniser
        if (!wasHoveredRef.current) {
          wasHoveredRef.current = true
        }
      } else if (wasHoveredRef.current && hoveredIndex !== index) {
        // Si un autre élément est survolé et que celui-ci pensait l'être, le synchroniser
        wasHoveredRef.current = false

        if (videoRef.current) {
          videoRef.current.pause()
          videoRef.current.currentTime = timestamp // Réinitialiser la vidéo
        }
      }
    }, [hoveredIndex, index])

    const handleMouseEnter = () => {
      setHoveredIndex(index)
      baseHandleMouseEnter()
    }

    const handleMouseLeave = () => {
      setHoveredIndex(null)
      baseHandleMouseLeave()
    }

    // Observer d'intersection pour optimiser le rendu des vidéos
    useEffect(() => {
      if (!itemRef.current) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isVisibleRef.current = entry.isIntersecting
            if (videoRef.current) {
              videoRef.current.pause()
            }
          })
        },
        {
          root: null,
          rootMargin: '50%',
          threshold: 0,
        }
      )

      observer.observe(itemRef.current)
      return () => observer.disconnect()
    }, [])

    const handleVideoMetadata = (event: any) => {
      const video = event.target
      if (video?.videoWidth && video.videoHeight) {
        const aspectRatio = video.videoWidth / video.videoHeight
        setAspectRatio(aspectRatio)
        video.pause()
      }
      onMetadataLoaded(index, event)
    }

    const setRefs = (element: HTMLDivElement | null) => {
      itemRef.current = element
      if (typeof ref === 'function') {
        ref(element)
      } else if (ref) {
        ref.current = element
      }
    }

    const isLoading = !playbackIdRef

    const handleClickNoSlug = (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault()
      setShowModal(true)
    }

    const handleCloseModal = () => {
      setShowModal(false)
    }

    useEffect(() => {
      const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768
      if (!isMobile) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setHoveredIndex(index)
          }
        },
        {
          threshold: 0.5,
        }
      )

      if (itemRef.current) {
        observer.observe(itemRef.current)
      }

      return () => {
        if (itemRef.current) {
          observer.unobserve(itemRef.current)
        }
      }
    }, [index, setHoveredIndex])

    // Effet pour gérer l'ouverture du modal
    useEffect(() => {
      if (showModal) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }

      return () => {
        document.body.style.overflow = ''
      }
    }, [showModal])

    // Portail pour le modal
    const renderModal = () => {
      if (!showModal) return null

      // Vérifier si on est dans le navigateur (client-side)
      if (typeof document === 'undefined') return null

      return createPortal(
        <div className="fixed inset-0 z-50">
          <ModalPlayer
            videoId={playbackIdRef}
            color={project.color?.value}
            onClose={handleCloseModal}
          />
        </div>,
        document.body
      )
    }

    return (
      <>
        {renderModal()}
        <div
          ref={setRefs}
          className={cn(
            s.sliderItem,
            className,
            isDimmed && s['sliderItem--dimmed']
          )}
          onClick={project.slug ? undefined : handleClickNoSlug}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className={s.videoContainer}>
            {isLoading ? (
              <div className={s.sliderItem__loading}>Chargement...</div>
            ) : !playbackIdRef ? (
              <div className={s.sliderItem__placeholderVideo}>
                <p>Vidéo non disponible</p>
              </div>
            ) : project.slug ? (
              <TransitionLink
                slug={`work/${project.slug.current}`}
                className={s.fullSize}
              >
                <MuxPlayer
                  ref={videoRef}
                  className={cn(s.sliderItem__muxPlayer, 'mobile:w-screen')}
                  streamType="on-demand"
                  playbackId={playbackIdRef}
                  loop
                  muted
                  playsInline
                  preload="auto"
                  preferPlayback="mse"
                  maxResolution="1080p"
                  minResolution="1080p"
                  autoPlay={false}
                  {...(isSafariDesktop
                    ? { onLoadedData: handleVideoMetadata }
                    : { onLoadedMetadata: handleVideoMetadata })}
                  startTime={timestamp}
                  metadata={{
                    video_title: `Project ${index}`,
                    player_name: 'Project Slider',
                    player_init_time: new Date().toString(),
                    viewer_user_agent:
                      typeof navigator !== 'undefined'
                        ? navigator.userAgent
                        : '',
                  }}
                />
              </TransitionLink>
            ) : (
              <MuxPlayer
                ref={videoRef}
                className={cn(s.sliderItem__muxPlayer, 'mobile:w-screen')}
                streamType="on-demand"
                playbackId={playbackIdRef}
                loop
                muted
                playsInline
                preload="auto"
                preferPlayback="mse"
                maxResolution="1080p"
                minResolution="1080p"
                autoPlay={false}
                {...(isSafariDesktop
                  ? { onLoadedData: handleVideoMetadata }
                  : { onLoadedMetadata: handleVideoMetadata })}
                startTime={timestamp}
                metadata={{
                  video_title: `Project ${index}`,
                  player_name: 'Project Slider',
                  player_init_time: new Date().toString(),
                  viewer_user_agent:
                    typeof navigator !== 'undefined' ? navigator.userAgent : '',
                }}
              />
            )}
          </div>
        </div>
      </>
    )
  }
)
