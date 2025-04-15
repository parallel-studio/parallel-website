const colors = {
  black: '#000000',
  white: '#ffffff',
  red: '#e30613',
  'santas-gray': '#a3a3a4',
} as const

const themeNames = ['light', 'dark', 'red'] as const
const colorNames = ['primary', 'secondary', 'contrast', 'text-muted'] as const

const themes = {
  light: {
    primary: colors.white,
    secondary: colors.black,
    contrast: colors.red,
    'text-muted': colors['santas-gray'],
  },
  dark: {
    primary: colors.black,
    secondary: colors.white,
    contrast: colors.red,
    'text-muted': colors['santas-gray'],
  },
  red: {
    primary: colors.red,
    secondary: colors.black,
    contrast: colors.white,
    'text-muted': colors['santas-gray'],
  },
} as const satisfies Themes

export { colors, themeNames, themes }

// UTIL TYPES
type Themes = Record<
  (typeof themeNames)[number],
  Record<(typeof colorNames)[number], string>
>
