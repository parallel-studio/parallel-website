import { useEffect, useState } from 'react'

/**
 * Hook pour gérer la hauteur du conteneur et l'adapter aux changements de fenêtre
 * @param containerRef Référence vers l'élément conteneur
 * @returns Hauteur actuelle du conteneur
 */
export function useContainerHeight<T extends HTMLElement>(
  containerRef: React.RefObject<T | null>
) {
  const [containerHeight, setContainerHeight] = useState<number>(0)

  useEffect(() => {
    const updateContainerHeight = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight)
      }
    }

    // Mettre à jour la hauteur initiale
    updateContainerHeight()

    // S'abonner aux événements de redimensionnement
    window.addEventListener('resize', updateContainerHeight)

    // Nettoyer l'écouteur d'événement lors du démontage
    return () => {
      window.removeEventListener('resize', updateContainerHeight)
    }
  }, [containerRef])

  return containerHeight
}
