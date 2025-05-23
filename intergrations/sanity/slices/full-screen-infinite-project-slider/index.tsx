'use client'

import { useGSAP } from '@gsap/react'
import cn from 'clsx'
import gsap from 'gsap'
import {
  type FC,
  type MouseEvent,
  type TouchEvent,
  type WheelEvent,
  useRef,
} from 'react'
import { useDeviceDetection } from '~/hooks/use-device-detection'
import { SliderItem } from './components/slider-item'
import { Title } from './components/slider-title'
import s from './full-screen-infinite-project-slider.module.css'
import { horizontalLoop } from './helpers'
import { useContainerHeight } from './hooks/use-container-height'
import { useGsap } from './hooks/use-gsap'
import { useSliderAnimation } from './hooks/use-slider-animation'
import { useSliderInteraction } from './hooks/use-slider-interaction'
import { useSliderStore } from './store/use-slider-store'

export interface IProjectParallel {
  slug: {
    current: string
  }
  color: {
    value: string
  }
  Videos: {
    video_short: {
      asset: {
        playbackId: string
      }
    }
    video_long: {
      asset: {
        playbackId: string
      }
    }
  }
  video: keyof IProjectParallel['Videos']
  muxPlaceholderTimestamp: string
  details: {
    title: string
    description: string
    customer: string
    expertise: string
  }
}

export interface FullScreenInfiniteProjectSliderProps {
  projects?:
    | IProjectParallel[]
    | Array<{
        _type: string
        project?: any
        item?: any
      }>
  project?: any
  settings?: {
    sliderSpeed?: number
  }
  title?: string
}

export const FullScreenInfiniteProjectSlider: FC<
  FullScreenInfiniteProjectSliderProps
> = ({
  projects = [],
  project,
  settings = { sliderSpeed: 20 },
  title = '',
}: FullScreenInfiniteProjectSliderProps) => {
  const { isMobile } = useDeviceDetection()
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])
  const containerHeight = useContainerHeight(containerRef)
  const videoAspectRatiosRef = useRef<number[]>([])
  const loopRef = useRef<gsap.core.Timeline | null>(null)
  const videosLoadedRef = useRef<boolean[]>([])
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const {
    setMousePosition,
    hoveredIndex,
    setHoveredIndex,
    isPausedFromHover,
    setIsPausedFromHover,
  } = useSliderStore()
  const lastMousePosition = useRef<{ x: number; y: number } | null>(null)
  const hoveredCardRef = useRef<number | null>(null)
  const isCheckingHover = useRef<boolean>(false)
  const isHoveredFromLeave = useRef<boolean>(false)

  const { animateCardsReveal } = useSliderAnimation({
    sectionRef,
    sliderSpeed: settings?.sliderSpeed ?? 2.0,
  })

  const {
    touchStartRef,
    touchPrevRef,
    handleDelta,
    handleSliderMouseEnter,
    handleSliderMouseLeave,
    isScrollingRef,
  } = useSliderInteraction({
    loopRef,
    sliderSpeed: settings?.sliderSpeed ?? 2.0,
    onScroll: () => {
      if (lastMousePosition.current) {
        setMousePosition({ ...lastMousePosition.current })
      }
    },
  })

  const processProjects = () => {
    if (projects && projects.length > 0) {
      if ('_type' in projects[0]) {
        return projects
          .map((item: any) => {
            if (item._type === 'project' && item.project) {
              return {
                ...item.project,
                _type: 'project',
                video: item.project.video || 'video_short',
              }
            }
            if (item._type === 'item' && item.item) {
              return {
                _type: 'item',
                Videos: {
                  video_short: {
                    ...item.item.video,
                  },
                },
                video: 'video_short',
                color: {
                  value: '#000000',
                },
                muxPlaceholderTimestamp: item.item.muxPlaceholderTimestamp,
                details: {
                  title: item.item.title || '',
                },
                tagLabel: item.item.tagLabel || '',
                tag: item.item.tag || '',
              }
            }
            return null
          })
          .filter(Boolean)
      }
      return projects
    }

    if (project) {
      return [project]
    }

    return []
  }

  const projectsToRender = processProjects()

  useGSAP(
    () => {
      if (projectsToRender.length > 0) {
        videosLoadedRef.current = new Array(projectsToRender.length).fill(false)
        videoAspectRatiosRef.current = new Array(projectsToRender.length).fill(
          16 / 9
        )

        if (isMobile) {
          setTimeout(() => {
            const allLoaded = videosLoadedRef.current.every((item) => item)
            if (!allLoaded) {
              initLoop()
              setTimeout(() => {
                animateCardsReveal()
              }, 300)
            }
          }, 2000)
        }
      }
    },
    { dependencies: [projectsToRender.length, isMobile] }
  )

  const checkMouseOverElement = (index: number) => {
    if (!lastMousePosition.current || !cardsRef.current[index]) return false

    const card = cardsRef.current[index]
    const rect = card.getBoundingClientRect()
    const x = gsap.getProperty(card, 'x') as number

    return (
      lastMousePosition.current.x >= rect.left + x &&
      lastMousePosition.current.x <= rect.right + x &&
      lastMousePosition.current.y >= rect.top &&
      lastMousePosition.current.y <= rect.bottom
    )
  }

  useGsap(() => {
    gsap.to('html', {
      '--logo-color': '#000000',
      duration: 0.5,
      ease: 'power1.in',
    })
  })

  useGsap(
    (timeline) => {
      if (hoveredIndex !== null) {
        // Sur mobile, nous ne mettons pas en pause la boucle
        if (
          !isMobile &&
          loopRef.current &&
          !loopRef.current.paused() &&
          !isScrollingRef.current
        ) {
          loopRef.current.pause()
        }
        isHoveredFromLeave.current = false
        setIsPausedFromHover(!isMobile) // Seulement mettre à true sur desktop
      } else if (!isScrollingRef.current) {
        isHoveredFromLeave.current = true
        if (loopRef.current && loopRef.current.paused() && !isPausedFromHover) {
          const originalSpeed = settings?.sliderSpeed ?? 2.0
          loopRef.current.timeScale(originalSpeed)
          loopRef.current.play()
        }
        setIsPausedFromHover(false)
      }
    },
    {
      deps: [hoveredIndex, isScrollingRef.current, isMobile],
    }
  )

  useGsap(
    (timeline) => {
      if (isScrollingRef.current && lastMousePosition.current) {
        if (isCheckingHover.current) return

        isCheckingHover.current = true

        let foundHovered = false
        for (let i = 0; i < cardsRef.current.length; i++) {
          if (checkMouseOverElement(i)) {
            foundHovered = true
            if (hoveredIndex !== i) {
              if (hoveredIndex !== null) {
                handleSliderMouseLeave()
              }
              hoveredCardRef.current = i
              setHoveredIndex(i)
              handleSliderMouseEnter()
            }
            break
          }
        }

        if (!foundHovered && hoveredIndex !== null) {
          hoveredCardRef.current = null
          handleSliderMouseLeave()
          setHoveredIndex(null)
        }

        isCheckingHover.current = false

        setTimeout(() => {
          isCheckingHover.current = false
        }, 50)
      }
    },
    {
      deps: [isScrollingRef.current, lastMousePosition.current, hoveredIndex],
    }
  )

  const initLoop = () => {
    if (!containerRef.current || cardsRef.current.length === 0) return

    if (loopRef.current) {
      loopRef.current.kill()
    }

    // Détection de Safari desktop
    const isSafariDesktop =
      typeof window !== 'undefined' &&
      /^((?!chrome|android).)*safari/i.test(navigator.userAgent) &&
      !isMobile

    // Gestion spéciale pour Safari desktop
    if (isSafariDesktop) {
      // Pour Safari, on cache initialement chaque carte avec visibility:hidden
      // au lieu d'opacity pour éviter le flash
      cardsRef.current.forEach((card) => {
        gsap.set(card, {
          visibility: 'hidden',
          opacity: 0,
        })
      })
    }

    const firstItemPadding = Number.parseInt(
      window.getComputedStyle(cardsRef.current[0]).paddingRight
    )

    const loop = horizontalLoop(cardsRef.current, {
      draggable: false,
      speed: 20 / 100,
      repeat: -1,
      paused: false,
      reversed: false,
      paddingRight: firstItemPadding,
      paddingLeft: firstItemPadding,
    })

    if (loop) {
      loopRef.current = loop

      // Animation progressive pour Safari desktop
      if (isSafariDesktop) {
        // Attendre que le loop soit initialisé avant de rendre les cartes visibles
        setTimeout(() => {
          cardsRef.current.forEach((card, index) => {
            // Définir d'abord visibility:visible
            gsap.set(card, { visibility: 'visible' })

            // Puis animer l'opacité avec un décalage pour un effet progressif
            gsap.to(card, {
              opacity: 1,
              duration: 0.5,
              delay: index * 0.03, // Petit décalage entre chaque carte
              ease: 'power1.inOut',
            })
          })
        }, 100)
      }
    }
  }

  const handleMetadataLoaded = (index: number, event: any) => {
    const video = event.target
    if (video && video.videoWidth && video.videoHeight) {
      const aspectRatio = video.videoWidth / video.videoHeight
      const projectIndex = index % projectsToRender.length

      videoAspectRatiosRef.current[projectIndex] = aspectRatio
      videosLoadedRef.current[projectIndex] = true

      console.log(
        `Vidéo ${projectIndex} chargée (${videosLoadedRef.current.filter(Boolean).length}/${videosLoadedRef.current.length})`
      )

      const allVideosLoaded = videosLoadedRef.current.every((loaded) => loaded)

      if (allVideosLoaded) {
        if (timerRef.current) {
          clearTimeout(timerRef.current)
        }

        timerRef.current = setTimeout(() => {
          console.log(
            'Toutes les vidéos sont chargées, initialisation du slider'
          )
          initLoop()
          setTimeout(() => {
            animateCardsReveal()
          }, 200)
        }, 100)
      } else {
        const loadedCount = videosLoadedRef.current.filter(Boolean).length
        const threshold = Math.ceil(videosLoadedRef.current.length / 2)

        if (isMobile && loadedCount >= threshold && !loopRef.current) {
          console.log(
            `Mobile: ${loadedCount}/${videosLoadedRef.current.length} vidéos chargées, démarrage anticipé`
          )
          initLoop()
          setTimeout(() => {
            animateCardsReveal()
          }, 200)
        }
      }
    }
  }

  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    handleDelta(e.deltaY)
    if (lastMousePosition.current) {
      setMousePosition({ ...lastMousePosition.current })
    }
  }

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      touchStartRef.current = isMobile ? e.touches[0].clientX : e.touches[0].clientY
      touchPrevRef.current = isMobile ? e.touches[0].clientX : e.touches[0].clientY
    }
  }

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (touchPrevRef.current !== null && e.touches.length > 0) {
      if (isMobile) {
        const currentX = e.touches[0].clientX
        const delta = touchPrevRef.current - currentX
        handleDelta(delta * 3)
        touchPrevRef.current = currentX
      } else {
        const currentY = e.touches[0].clientY
        const delta = touchPrevRef.current - currentY
        handleDelta(delta * 3)
        touchPrevRef.current = currentY
      }
    }
  }

  const handleTouchEnd = () => {
    touchStartRef.current = null
    touchPrevRef.current = null
  }

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const position = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
    lastMousePosition.current = position
  }

  const handleMouseLeave = () => {
    lastMousePosition.current = null
    setMousePosition(null)
  }

  if (projectsToRender.length === 0) {
    return null
  }

  return (
    <section
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(s.mwg_effect008, 'p-safe grow bg-primary text-secondary')}
      ref={sectionRef}
    >
      <div className={s.full_screen_infinite_project_slider__top}>
        <Title defaultTitle={title} projects={projectsToRender} />
      </div>
      <div className={cn(s.container, 'dr-h-400')} ref={containerRef}>
        {projectsToRender.map((project, index) => (
          <SliderItem
            key={index}
            project={project}
            index={index}
            onMetadataLoaded={handleMetadataLoaded}
            containerHeight={containerHeight}
            className={cn(s.card, 'dr-px-3')}
            ref={(el) => {
              if (el) cardsRef.current[index] = el
            }}
            onMouseEnterSlider={handleSliderMouseEnter}
            onMouseLeaveSlider={handleSliderMouseLeave}
            isScrolling={isScrollingRef.current}
          />
        ))}
      </div>
    </section>
  )
}

export default FullScreenInfiniteProjectSlider
