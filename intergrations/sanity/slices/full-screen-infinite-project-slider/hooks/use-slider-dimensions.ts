import { useEffect, useRef } from 'react'
import { useDeviceDetection } from '../../../../../hooks/use-device-detection'

interface UseSliderDimensionsProps {
  containerHeight?: number
}

export const useSliderDimensions = ({
  containerHeight,
}: UseSliderDimensionsProps) => {
  const itemRef = useRef<HTMLDivElement | null>(null)
  const aspectRatioRef = useRef<number>(16 / 9)
  const { isMobile } = useDeviceDetection()

  const updateDimensions = () => {
    if (!itemRef.current || !containerHeight) return

    const element = itemRef.current

    if (!isMobile) {
      const width = containerHeight * aspectRatioRef.current
      element.style.width = `${width}px`
    } else {
      element.style.width = '100%'
    }
  }

  useEffect(() => {
    updateDimensions()
    window.addEventListener('resize', updateDimensions)

    return () => {
      window.removeEventListener('resize', updateDimensions)
    }
  }, [containerHeight, isMobile])

  return {
    itemRef,
    aspectRatioRef,
    setAspectRatio: (ratio: number) => {
      aspectRatioRef.current = ratio
      updateDimensions()
    },
  }
}
