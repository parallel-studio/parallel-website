import { Anton_SC, Inter } from 'next/font/google'
import localFont from 'next/font/local'

const anton = Anton_SC({
  subsets: ['latin'],
  variable: '--font-anton',
  display: 'swap',
  preload: true,
  weight: '400',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
  weight: ['400', '500', '700'],
})

const mono = localFont({
  src: [
    {
      path: '../public/fonts/ServerMono/ServerMono-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-mono',
  preload: true,
})

const fonts = [mono, anton, inter]
const fontsClassName = fonts.map((font) => font.className).join(' ')

export { fontsClassName }
