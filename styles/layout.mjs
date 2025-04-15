// THIS FILE HAS TO STAY .mjs AS ITS CONSUMED BY POSTCSS
const breakpoints = {
  dt: 800,
}

const screens = {
  mobile: { width: 375, height: 650 },
  desktop: { width: 1440, height: 816 },
  // desktop: { width: 1920, height: 1080 },
}

const layout = {
  columns: { mobile: 4, desktop: 12 },
  gap: { mobile: 16, desktop: 16 },
  safe: { mobile: 16, desktop: 20 },
  'safe-half': { mobile: 8, desktop: 10 },
}

const customSizes = {
  'header-height': { mobile: 58, desktop: 98 },
}

export { breakpoints, customSizes, layout, screens }
