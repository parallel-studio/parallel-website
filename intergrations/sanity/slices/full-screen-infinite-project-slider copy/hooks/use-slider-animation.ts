import { useRef } from 'react'
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

  // Version avec useGsap - mais pas utilisée directement pour permettre le contrôle manuel de l'animation
  const animationControls = useGsap(
    (timeline) => {
      timeline.to(
        sectionRef.current,
        {
          opacity: 1,
          duration: 1.0,
          ease: 'power3.out',
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
      deps: [sectionRef.current, sliderSpeed], // Recréer l'animation si ces valeurs changent
    }
  )

  // Fonction pour déclencher manuellement l'animation
  const animateCardsReveal = () => {
    if (revealAnimationDoneRef.current || !sectionRef.current) return

    // Utiliser les contrôles de notre timeline créée avec useGsap
    animationControls.play()
  }

  return {
    animateCardsReveal,
    revealAnimationDoneRef,
  }
}
