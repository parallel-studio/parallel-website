'use client'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { X } from 'lucide-react'
import dynamic from 'next/dynamic'
import { type FC, useEffect, useRef, useState } from 'react'
import s from './modal-player.module.css'
const MuxPlayer = dynamic(() => import('@mux/mux-player-react'), { ssr: false })

export interface ModalPlayerProps {
  videoId: string
  color: string
  onClose: () => void
  aspectRatio?: string // Format: 'width / height', e.g., '16 / 9' or '9 / 16'
}

export const ModalPlayer: FC<ModalPlayerProps> = ({
  videoId,
  color,
  onClose,
  aspectRatio,
}) => {
  // const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  // if (isMobile) return null;

  const containerRef = useRef<HTMLDivElement>(null)
  const containerVideoRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<any>(null)
  const [videoAspectRatio, setVideoAspectRatio] = useState<number | null>(null)
  const [isIntermediateScreen, setIsIntermediateScreen] =
    useState<boolean>(false)

  // Détecter si on est sur un écran intermédiaire
  useEffect(() => {
    const checkScreenSize = () => {
      const windowWidth = window.innerWidth
      setIsIntermediateScreen(windowWidth >= 769 && windowWidth <= 1200)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)

    return () => {
      window.removeEventListener('resize', checkScreenSize)
    }
  }, [])

  useGSAP(() => {
    const header = document.getElementById('nav')
    gsap.set(header, { zIndex: -1 })
    gsap.to(containerRef.current, {
      opacity: 1,
      duration: 0.75,
      ease: 'power2.out',
      pointerEvents: 'auto',
    })
  }, [])

  // Ajuster les dimensions du conteneur vidéo en fonction du ratio d'aspect
  useEffect(() => {
    if (!containerVideoRef.current || !videoAspectRatio) return

    const updateDimensions = () => {
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight
      const isIntermediateScreen = windowWidth >= 769 && windowWidth <= 1200

      // Ajuster les facteurs pour les différentes tailles d'écran
      const widthFactor = isIntermediateScreen ? 0.85 : 0.9
      const heightFactor = isIntermediateScreen ? 0.85 : 0.9

      const maxWidth = windowWidth * widthFactor
      const maxHeight = windowHeight * heightFactor

      let width
      let height

      if (videoAspectRatio > 1) {
        // Vidéo horizontale
        width = Math.min(maxWidth, maxHeight * videoAspectRatio)
        height = width / videoAspectRatio

        // Assurer que la hauteur ne dépasse pas maxHeight
        if (height > maxHeight) {
          height = maxHeight
          width = height * videoAspectRatio
        }
      } else {
        // Vidéo verticale
        height = Math.min(maxHeight, maxWidth / videoAspectRatio)
        width = height * videoAspectRatio

        // Assurer que la largeur ne dépasse pas maxWidth
        if (width > maxWidth) {
          width = maxWidth
          height = width / videoAspectRatio
        }
      }

      // Ajouter un padding supplémentaire pour les écrans intermédiaires
      if (isIntermediateScreen) {
        width = Math.min(width, maxWidth - 40) // 20px padding de chaque côté
        height = Math.min(height, maxHeight - 40)
      }

      if (containerVideoRef.current) {
        containerVideoRef.current.style.width = `${width}px`
        containerVideoRef.current.style.height = `${height}px`
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)

    return () => {
      window.removeEventListener('resize', updateDimensions)
    }
  }, [videoAspectRatio])

  const handleVideoMetadataLoaded = (event: any) => {
    const video = event.target
    if (video?.videoWidth && video.videoHeight) {
      const ratio = video.videoWidth / video.videoHeight
      setVideoAspectRatio(ratio)
    }

    const tl = gsap.timeline({
      onComplete: () => {
        videoRef.current?.play()
      },
    })

    tl.to(
      containerVideoRef.current,
      {
        opacity: 1,
        duration: 0.75,
        ease: 'power2.out',
        pointerEvents: 'auto',
      },
      0.25
    )
  }

  const handleClose = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        onClose()
      },
    })
    const header = document.getElementById('nav')
    gsap.set(header, { zIndex: 2 })

    tl.to(containerRef.current, {
      opacity: 0,
      duration: 0.75,
      ease: 'power2.out',
      pointerEvents: 'none',
    })
    tl.to(
      containerVideoRef.current,
      {
        opacity: 0,
        duration: 0.75,
        ease: 'power2.out',
        pointerEvents: 'none',
      },
      0.25
    )
  }

  return (
    <div className={s.modal_player} ref={containerRef} onClick={handleClose}>
      <div
        className={s.modal_player__wrapper}
        ref={containerVideoRef}
        onClick={(e) => e.stopPropagation()}
      >
        <X className={s.close_icon} onClick={handleClose} />
        <MuxPlayer
          theme="media-theme-tiny"
          ref={videoRef}
          className={s.player}
          primaryColor="white"
          accentColor={color}
          secondaryColor="transparent"
          thumbnailTime={0}
          streamType="on-demand"
          playbackId={videoId}
          preload="auto"
          playsInline
          minResolution="1080p"
          maxResolution="1080p"
          preferPlayback="mse"
          onLoadedMetadata={handleVideoMetadataLoaded}
          style={
            {
              '--media-object-fit': 'contain',
            } as React.CSSProperties
          }
        />
      </div>
    </div>
  )
}
