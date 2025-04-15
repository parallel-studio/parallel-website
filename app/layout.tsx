import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'
import cn from 'clsx'
import type { Metadata, Viewport } from 'next'
import { ViewTransitions } from 'next-view-transitions'
import type { PropsWithChildren } from 'react'
import { ReactTempus } from 'tempus/react'
import { GSAP } from '~/components/gsap'
import { RealViewport } from '~/components/real-viewport'
import { SanityContextProvider } from '~/intergrations/sanity/context'
import AppData from '~/package.json'
import { sanityFetch } from '~/sanity/lib/client'
import { PARALLEL_FOOTER_QUERY, PARALLEL_HEADER_QUERY } from '~/sanity/queries'
import {
  type PARALLEL_FOOTER_QUERYResult,
  type PARALLEL_HEADER_QUERYResult,
} from '~/sanity/types'
import { themes } from '~/styles/colors'
import '~/styles/css/index.css'
import { fontsClassName } from '~/styles/fonts'
import { Wrapper } from './(pages)/(components)/wrapper'

const APP_NAME = AppData.name
const APP_DEFAULT_TITLE = 'Parallel - Studio'
const APP_TITLE_TEMPLATE = 'Parallel - Studio'
const APP_DESCRIPTION = AppData.description
const APP_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

const GTM_ID = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID || false
const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS || false

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: '%s',
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'viewport-fit': 'cover',
  },
  openGraph: {
    type: 'website',
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: '%s',
    },
    description: APP_DESCRIPTION,
    url: APP_BASE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: {
      default: APP_DEFAULT_TITLE,
      template: '%s',
    },
    description: APP_DESCRIPTION,
  },
  authors: [
    { name: 'darkroom.engineering', url: 'https://darkroom.engineering' },
  ],
}

export const viewport: Viewport = {
  themeColor: themes.light.primary,
  colorScheme: 'normal',
}

export default async function Layout({ children }: PropsWithChildren) {
  const headerData = await sanityFetch<PARALLEL_HEADER_QUERYResult>({
    query: PARALLEL_HEADER_QUERY,
    params: { language: 'en' },
  })

  const footerData = await sanityFetch<PARALLEL_FOOTER_QUERYResult>({
    query: PARALLEL_FOOTER_QUERY,
    params: { language: 'en' },
  })

  return (
    <ViewTransitions>
      <html
        lang="en"
        dir="ltr"
        className={cn(fontsClassName, 'bg-primary text-secondary')}
        // NOTE: This is due to the data-theme attribute being set which causes hydration errors
        suppressHydrationWarning
      >
        {GTM_ID && <GoogleTagManager gtmId={GTM_ID} />}
        <body suppressHydrationWarning>
          <RealViewport />
          <SanityContextProvider
            data={{
              header: headerData,
              footer: footerData,
            }}
          >
            <Wrapper theme="light" lenis={{}}>
              {children}
            </Wrapper>
          </SanityContextProvider>
          <GSAP scrollTrigger />
          {/* @ts-expect-error - TODO: Fix in tempus */}
          <ReactTempus patch />
        </body>
        {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
      </html>
    </ViewTransitions>
  )
}
