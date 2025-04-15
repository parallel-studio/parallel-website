import type { CSSProperties } from 'react'

const fonts = {
  inter: {
    variable: '--font-inter',
    family: 'Inter',
  },
  anton: {
    variable: '--font-anton',
    family: 'Anton sc',
  },
} as const

const headingDefault = {
  'font-family': `var(${fonts.anton.variable})`,
  'font-style': 'normal',
  'font-weight': 400,
  'letter-spacing': '0%',
}

const headingAltDefault = {
  'font-family': `var(${fonts.inter.variable})`,
  'font-style': 'normal',
  'font-weight': 600,
  'letter-spacing': '0%',
}

const textDefault = {
  'font-family': `var(${fonts.inter.variable})`,
  'font-style': 'normal',
  'font-weight': 400,
  'letter-spacing': '0%',
}

const element = {
  'text-navbar': {
    'font-family': `var(${fonts.inter.variable})`,
    'font-style': 'normal',
    'text-transform': 'uppercase',
    'font-weight': 500,
    'font-variation-settings': "'wght' 500",
    'letter-spacing': '0%',
    'line-height': '100%',
    'font-size': { mobile: 14, desktop: 16 },
  },
  'text-tag-label': {
    'font-family': `var(${fonts.inter.variable})`,
    'font-style': 'normal',
    'font-weight': 700,
    'letter-spacing': '0%',
    'line-height': '0',
    'font-size': { mobile: 10, desktop: 10 },
  },
}

const text = {
  'text-xxlarge': {
    ...textDefault,
    'line-height': '160%',
    'font-size': { mobile: 32, desktop: 32 },
  },
  'text-xlarge': {
    ...textDefault,
    'line-height': '160%',
    'font-size': { mobile: 28, desktop: 28 },
  },
  'text-large': {
    ...textDefault,
    'line-height': '170%',
    'font-size': { mobile: 24, desktop: 24 },
  },
  'text-medium': {
    ...textDefault,
    'line-height': '170%',
    'font-size': { mobile: 22, desktop: 22 },
  },
  'text-default': {
    ...textDefault,
    'line-height': '180%',
    'font-size': { mobile: 20, desktop: 20 },
  },
  'text-small': {
    ...textDefault,
    'line-height': '180%',
    'font-size': { mobile: 18, desktop: 18 },
  },
  'text-xsmall': {
    ...textDefault,
    'line-height': '180%',
    'font-size': { mobile: 16, desktop: 16 },
  },
}

const headingAlt = {
  'alt-h-small': {
    ...headingAltDefault,
    'line-height': '120%',
    'font-size': { mobile: 20, desktop: 80 },
  },
  'alt-h1': {
    ...headingAltDefault,
    'line-height': '130%',
    'font-size': { mobile: 20, desktop: 64 },
  },
  'alt-h2': {
    ...headingAltDefault,
    'line-height': '130%',
    'font-size': { mobile: 20, desktop: 48 },
  },
  'alt-h3': {
    ...headingAltDefault,
    'line-height': '140%',
    'font-size': { mobile: 20, desktop: 40 },
  },
  'alt-h4': {
    ...headingAltDefault,
    'line-height': '130%',
    'font-size': { mobile: 20, desktop: 32 },
  },
  'alt-h5': {
    ...headingAltDefault,
    'line-height': '130%',
    'font-size': { mobile: 20, desktop: 26 },
  },
}

const heading: TypeStyles = {
  'h-xxlarge': {
    ...headingDefault,
    'line-height': '100%',
    'font-size': { mobile: 20, desktop: 320 },
  },
  'h-xlarge': {
    ...headingDefault,
    'line-height': '100%',
    'font-size': { mobile: 20, desktop: 240 },
  },
  'h-large': {
    ...headingDefault,
    'line-height': '100%',
    'font-size': { mobile: 20, desktop: 192 },
  },
  'h-medium': {
    ...headingDefault,
    'line-height': '100%',
    'font-size': { mobile: 20, desktop: 160 },
  },
  'h-small': {
    ...headingDefault,
    'line-height': '100%',
    'font-size': { mobile: 20, desktop: 128 },
  },
  h1: {
    ...headingDefault,
    'line-height': '110%',
    'font-size': { mobile: 20, desktop: 96 },
  },
  h2: {
    ...headingDefault,
    'line-height': '110%',
    'font-size': { mobile: 20, desktop: 80 },
  },
  h3: {
    ...headingDefault,
    'line-height': '110%',
    'font-size': { mobile: 20, desktop: 64 },
  },
  h4: {
    ...headingDefault,
    'line-height': '130%',
    'font-size': { mobile: 20, desktop: 48 },
  },
  h5: {
    ...headingDefault,
    'line-height': '130%',
    'font-size': { mobile: 20, desktop: 32 },
  },
  h6: {
    ...headingDefault,
    'line-height': '130%',
    'font-size': { mobile: 20, desktop: 24 },
  },
}

const typography: TypeStyles = {
  ...heading,
  ...headingAlt,
  ...text,
  ...element,
  'test-anton': {
    'font-family': `var(${fonts.anton.variable})`,
    'font-style': 'normal',
    'font-weight': 400,
    'line-height': '90%',
    'letter-spacing': '0%',
    'font-size': { mobile: 20, desktop: 24 },
  },
} as const

export { fonts, typography }

// UTIL TYPES
type TypeStyles = Record<
  string,
  {
    'font-family': string
    'font-style': CSSProperties['fontStyle']
    'font-weight': CSSProperties['fontWeight']
    'line-height': `${number}%` | string
    'letter-spacing': `${number}%` | string
    'font-size': number | { mobile: number; desktop: number }
  }
>
