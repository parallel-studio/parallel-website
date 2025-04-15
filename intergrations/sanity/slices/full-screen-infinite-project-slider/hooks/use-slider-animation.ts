import { useEffect, useRef, useState } from 'react'
import { useGsap } from './use-gsap'

interface UseSliderAnimationProps {
  sectionRef: React.RefObject<HTMLDivElement | null>
  loopRef?: React.RefObject<gsap.core.Timeline | null>
  sliderSpeed: number
}

export const useSliderAnimation = ({
  sectionRef,
  sliderSpeed,
}: UseSliderAnimationProps) => {
  const revealAnimationDoneRef = useRef<boolean>(false)
  const [isSafariDesktop, setIsSafariDesktop] = useState(false)

  // Détecter Safari desktop
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isSafari = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent
      )
      const isDesktop = window.innerWidth > 768
      setIsSafariDesktop(isSafari && isDesktop)
    }
  }, [])

  // Effet pour cacher initialement la section correctement selon le navigateur
  useEffect(() => {
    if (!sectionRef.current) return

    // Plutôt que de dépendre du CSS, on définit l'opacité directement
    // On évite ainsi l'effet de clignotement sur Safari
    if (isSafariDesktop) {
      // Pour Safari, on utilise visibility:hidden pour éviter le flash initial
      // tout en gardant la structure dans le DOM
      sectionRef.current.style.visibility = 'hidden'
      sectionRef.current.style.opacity = '0'
    } else {
      // Pour les autres navigateurs, une simple opacité à 0 suffit
      sectionRef.current.style.opacity = '0'
    }
  }, [isSafariDesktop, sectionRef])

  // Version avec useGsap - mais pas utilisée directement pour permettre le contrôle manuel de l'animation
  const animationControls = useGsap(
    (timeline) => {
      if (!sectionRef.current) return

      // Utiliser une durée et une courbe d'easing différentes pour Safari desktop
      const duration = isSafariDesktop ? 0.5 : 1.0
      const ease = isSafariDesktop ? 'power1.inOut' : 'power3.out'

      if (isSafariDesktop) {
        // Pour Safari desktop, d'abord remettre visibility:visible
        timeline.set(sectionRef.current, { visibility: 'visible', opacity: 0 })
      }

      // Animer l'opacité de manière contrôlée
      timeline.to(
        sectionRef.current,
        {
          opacity: 1,
          duration: duration,
          ease: ease,
        },
        0
      )

      // On utilise l'événement onComplete pour marquer l'animation comme terminée
      timeline.eventCallback('onComplete', () => {
        revealAnimationDoneRef.current = true
      })
    },
    {
      autoPlay: false, // Important: ne pas démarrer automatiquement car on veut le contrôle manuel
      deps: [sectionRef.current, sliderSpeed, isSafariDesktop], // Recréer l'animation si ces valeurs changent
    }
  )

  // Fonction pour déclencher manuellement l'animation
  const animateCardsReveal = () => {
    if (revealAnimationDoneRef.current || !sectionRef.current) return

    // Animation plus directe et contrôlée
    animationControls.play()
  }

  return {
    animateCardsReveal,
    revealAnimationDoneRef,
    isSafariDesktop,
  }
}
