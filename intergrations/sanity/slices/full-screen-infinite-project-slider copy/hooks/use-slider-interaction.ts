import { useGSAP } from '@gsap/react'
import { useRef } from 'react'
import { useDeviceDetection } from '~/hooks/use-device-detection'
import { useSliderStore } from '../store/use-slider-store'
interface UseSliderInteractionProps {
  loopRef: React.MutableRefObject<gsap.core.Timeline | null>
  sliderSpeed: number
  onScroll?: () => void
}

export const useSliderInteraction = ({
  loopRef,
  sliderSpeed,
  onScroll,
}: UseSliderInteractionProps) => {
  const touchStartRef = useRef<number | null>(null)
  const touchPrevRef = useRef<number | null>(null)
  const scrollTimeout = useRef<any>(null)
  const baseSpeed = useRef<number>(sliderSpeed)
  const isScrolling = useRef<boolean>(false)
  const isHovered = useRef<boolean>(false)
  const lastDirection = useRef<number>(1)
  const scrollingRef = useRef<boolean>(false)
  const scrollCheckInterval = useRef<any>(null)
  const pauseTimeoutRef = useRef<any>(null)
  const isSafari = useRef<boolean>(
    typeof navigator !== 'undefined' &&
      /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
  )

  const { isPausedFromHover, setIsPausedFromHover } = useSliderStore()
  const { isMobile } = useDeviceDetection()

  const resetSpeed = () => {
    if (loopRef.current) {
      baseSpeed.current = sliderSpeed * lastDirection.current
      loopRef.current.timeScale(baseSpeed.current)

      // Fix Safari: s'assurer que l'animation continue correctement
      if (isSafari.current && !loopRef.current.isActive()) {
        loopRef.current.play()
      }
    }
  }

  // Nettoyage des intervalles et timeouts lors du démontage
  useGSAP(
    () => {
      return () => {
        if (scrollCheckInterval.current) {
          clearInterval(scrollCheckInterval.current)
          scrollCheckInterval.current = null
        }
        if (scrollTimeout.current) {
          clearTimeout(scrollTimeout.current)
          scrollTimeout.current = null
        }
        if (pauseTimeoutRef.current) {
          clearTimeout(pauseTimeoutRef.current)
          pauseTimeoutRef.current = null
        }
      }
    },
    { dependencies: [] }
  )

  // Synchroniser l'état de pause quand isPausedFromHover change
  useGSAP(
    () => {
      if (isMobile) return
      if (loopRef.current) {
        if (isPausedFromHover) {
          isHovered.current = true
          if (!isScrolling.current) {
            loopRef.current.pause()
          }
        } else {
          isHovered.current = false
          if (!isScrolling.current && loopRef.current.paused()) {
            resetSpeed()
            loopRef.current.play()
          }
        }
      }
    },
    { dependencies: [isPausedFromHover] }
  )

  const handleDelta = (delta: number) => {
    if (loopRef.current) {
      const isScrollingDown = delta > 0
      const scrollSpeed = Math.min(
        Math.abs(delta) * sliderSpeed,
        sliderSpeed * 30
      )

      isScrolling.current = true
      scrollingRef.current = true
      lastDirection.current = isScrollingDown ? 1 : -1
      baseSpeed.current = scrollSpeed * lastDirection.current

      if (isHovered.current) {
        baseSpeed.current *= 0.7
      }

      // Safari: Utiliser setTimeout plutôt que directement accéder à la timeline
      if (isSafari.current) {
        setTimeout(() => {
          if (loopRef.current) {
            loopRef.current.timeScale(baseSpeed.current)
            if (!loopRef.current.isActive()) {
              loopRef.current.play()
            }
          }
        }, 0)
      } else {
        loopRef.current.timeScale(baseSpeed.current)
        if (!loopRef.current.isActive()) {
          loopRef.current.play()
        }
      }

      // Déclencher l'événement de défilement
      onScroll?.()

      // Créer un intervalle pour déclencher régulièrement onScroll pendant le défilement
      if (scrollCheckInterval.current) {
        clearInterval(scrollCheckInterval.current)
      }

      // Vérifier le survol toutes les 50ms pendant le défilement actif
      scrollCheckInterval.current = setInterval(() => {
        if (isScrolling.current) {
          onScroll?.()
        } else {
          // Arrêter l'intervalle si le défilement est terminé
          clearInterval(scrollCheckInterval.current)
          scrollCheckInterval.current = null
        }
      }, 50)

      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current)
      }

      // Safari: utiliser un délai légèrement plus long
      const timeoutDuration = isSafari.current ? 150 : 100

      scrollTimeout.current = setTimeout(() => {
        if (loopRef.current) {
          if (!isHovered.current) {
            resetSpeed()
          } else {
            // Ajouter un délai pour la pause pour s'assurer que les autres états sont mis à jour correctement
            if (pauseTimeoutRef.current) {
              clearTimeout(pauseTimeoutRef.current)
            }
            pauseTimeoutRef.current = setTimeout(() => {
              if (isHovered.current && loopRef.current) {
                loopRef.current.pause()
                setIsPausedFromHover(true)
              }
              pauseTimeoutRef.current = null
            }, 50)
          }
          isScrolling.current = false
          scrollingRef.current = false

          // Nettoyer l'intervalle quand le défilement s'arrête
          if (scrollCheckInterval.current) {
            clearInterval(scrollCheckInterval.current)
            scrollCheckInterval.current = null
          }
        }
      }, timeoutDuration)
    }
  }

  const handleSliderMouseEnter = () => {
    isHovered.current = true
    setIsPausedFromHover(true)

    if (loopRef.current && !isScrolling.current) {
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current)
      }

      // Safari: délai légèrement plus long
      const timeoutDuration = isSafari.current ? 80 : 50

      pauseTimeoutRef.current = setTimeout(() => {
        if (isHovered.current && loopRef.current) {
          loopRef.current.pause()
        }
        pauseTimeoutRef.current = null
      }, timeoutDuration)
    }
  }

  const handleSliderMouseLeave = () => {
    isHovered.current = false
    setIsPausedFromHover(false)

    if (loopRef.current && !isScrolling.current) {
      // Safari: petit délai pour éviter les problèmes de timing
      if (isSafari.current) {
        setTimeout(() => {
          resetSpeed()
          if (loopRef.current) loopRef.current.play()
        }, 10)
      } else {
        resetSpeed()
        loopRef.current.play()
      }
    }
  }

  return {
    touchStartRef,
    touchPrevRef,
    handleDelta,
    handleSliderMouseEnter,
    handleSliderMouseLeave,
    isScrollingRef: scrollingRef,
    isHoveredRef: isHovered,
  }
}
