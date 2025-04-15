import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useEffect, useRef } from 'react'
import { useDeviceDetection } from '~/hooks/use-device-detection'

interface UseVideoPlayerProps {
  timestamp: number
  onMetadataLoaded: (index: number, event: any) => void
  index: number
  projectColor: string
  onMouseEnterSlider?: () => void
  onMouseLeaveSlider?: () => void
}

export const useVideoPlayer = ({
  timestamp,
  onMetadataLoaded,
  index,
  projectColor,
  onMouseEnterSlider,
  onMouseLeaveSlider,
}: UseVideoPlayerProps) => {
  const videoRef = useRef<any>(null)
  const isLoadedRef = useRef<boolean>(false)
  const { isMobile } = useDeviceDetection()

  useEffect(() => {
    // Assurer que la vidéo est bien chargée pour les appareils mobiles
    const checkVideoLoaded = () => {
      if (videoRef.current) {
        isLoadedRef.current = true
      }
    }

    // Vérifier si on est sur mobile
    // const isMobile =
    //   typeof window !== 'undefined' &&
    //   (window.innerWidth <= 768 ||
    //     /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    //       navigator.userAgent
    //     ))

    if (isMobile && videoRef.current) {
      videoRef.current.addEventListener('canplaythrough', checkVideoLoaded)
    }

    return () => {
      if (isMobile && videoRef.current) {
        videoRef.current.removeEventListener('canplaythrough', checkVideoLoaded)
      }
    }
  }, [])

  useGSAP(
    () => {
      // Pause la vidéo au montage et reset au timestamp
      if (videoRef.current) {
        videoRef.current.pause()
        videoRef.current.currentTime = timestamp
      }
    },
    { dependencies: [timestamp] }
  )

  const handleMouseEnter = () => {
    gsap.to('html', {
      '--logo-color': projectColor,
      duration: 0.5,
      ease: 'power1.in',
      overwrite: true,
    })
    if (videoRef.current) {
      const playVideo = () => {
        videoRef.current.play().catch((err: Error) => {
          console.warn('Erreur de lecture vidéo:', err)
          // Réessayer après un délai sur mobile
          setTimeout(() => {
            if (videoRef.current) {
              videoRef.current.play().catch(() => {})
            }
          }, 300)
        })
      }

      if (isLoadedRef.current) {
        playVideo()
      } else {
        // Si la vidéo n'est pas encore chargée, on attend un peu
        setTimeout(playVideo, 100)
      }
    }
    onMouseEnterSlider?.()
  }

  const handleMouseLeave = () => {
    gsap.to('html', { '--logo-color': '#000000' })
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = timestamp // Reset au timestamp quand la souris quitte
    }
    onMouseLeaveSlider?.()
  }

  const handleVideoMetadata = (event: any) => {
    isLoadedRef.current = true
    onMetadataLoaded(index, event)
  }

  return {
    videoRef,
    handleMouseEnter,
    handleMouseLeave,
    handleVideoMetadata,
  }
}
