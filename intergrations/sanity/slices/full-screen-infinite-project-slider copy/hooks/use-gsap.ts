import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef } from 'react'
gsap.registerPlugin(useGSAP)

type AnimationCallback = (timeline: gsap.core.Timeline) => void

interface UseGsapOptions {
  useLayout?: boolean
  autoPlay?: boolean
  deps?: React.DependencyList
}

/**
 * Hook de compatibilité qui adapte useGSAP officiel pour remplacer l'ancien useGsap personnalisé
 *
 * @param animationCallback Fonction qui définit l'animation à exécuter
 * @param options Options de configuration
 * @returns Contrôles similaires à ceux de l'ancien hook
 */
export function useGsap(
  animationCallback: AnimationCallback,
  options: UseGsapOptions = {}
) {
  const { autoPlay = true, deps = [] } = options
  const timelineRef = useRef<gsap.core.Timeline | null>(null)

  // Convertir deps en tableau non-readonly pour useGSAP
  const dependencies = [...deps] as unknown[]

  useGSAP(
    () => {
      // Créer une nouvelle timeline
      const timeline = gsap.timeline({ paused: !autoPlay })
      timelineRef.current = timeline

      // Appeler le callback avec la timeline
      animationCallback(timeline)

      // Nettoyer lors du démontage géré automatiquement par useGSAP
    },
    { dependencies }
  )

  // Fonctions utilitaires pour contrôler la timeline
  const controls = {
    play: () => timelineRef.current?.play(),
    pause: () => timelineRef.current?.pause(),
    restart: () => timelineRef.current?.restart(),
    reverse: () => timelineRef.current?.reverse(),
    timeScale: (value: number) => {
      if (timelineRef.current) {
        timelineRef.current.timeScale(value)
      }
    },
    progress: (value: number) => {
      if (timelineRef.current) {
        timelineRef.current.progress(value)
      }
    },
    kill: () => {
      if (timelineRef.current) {
        timelineRef.current.kill()
      }
      timelineRef.current = null
    },
    timeline: timelineRef,
  }

  return controls
}
