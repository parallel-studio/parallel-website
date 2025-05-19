// hooks/scroll.ts
export const saveScrollPosition = (key: string) => {
  sessionStorage.setItem(`scrollY-${key}`, window.scrollY.toString())
}


export const restoreScrollWhenReady = (key: string, checkReady: () => boolean) => {
  const saved = sessionStorage.getItem(`scrollY-${key}`)
  if (!saved) return

  const targetY = parseInt(saved, 10)
  let attempts = 0

  const interval = setInterval(() => {
    if (checkReady() || attempts > 40) {
      clearInterval(interval)
      window.scrollTo(0, targetY)
    }
    attempts++
  }, 100)
}
