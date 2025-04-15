import { create } from 'zustand'

interface SliderStore {
  hoveredIndex: number | null
  setHoveredIndex: (index: number | null) => void
  mousePosition: { x: number; y: number } | null
  setMousePosition: (position: { x: number; y: number } | null) => void
  isPausedFromHover: boolean
  setIsPausedFromHover: (isPaused: boolean) => void
}

export const useSliderStore = create<SliderStore>((set) => ({
  hoveredIndex: null,
  setHoveredIndex: (index) => set({ hoveredIndex: index }),
  mousePosition: null,
  setMousePosition: (position) => set({ mousePosition: position }),
  isPausedFromHover: false,
  setIsPausedFromHover: (isPaused) => set({ isPausedFromHover: isPaused }),
}))
