import { SliceMachine } from '~/intergrations/sanity/slices'
import { sanityFetch } from '~/sanity/lib/client'
import { PARALLEL_HOME_PAGE_QUERY } from '~/sanity/queries'
import { type PARALLEL_HOME_PAGE_QUERYResult } from '~/sanity/types'

export async function generateMetadata() {
  const homeData = await sanityFetch<PARALLEL_HOME_PAGE_QUERYResult>({
    query: PARALLEL_HOME_PAGE_QUERY,
    params: { language: 'en' },
  })

  return {
    title: homeData?.metaTitle || 'Parallel Studio',
    description: homeData?.metaDescription || 'Parallel Studio',
  }
}

export default async function Home() {
  const homeData = await sanityFetch<PARALLEL_HOME_PAGE_QUERYResult>({
    query: PARALLEL_HOME_PAGE_QUERY,
    params: { language: 'en' },
  })

  return <SliceMachine slices={homeData?.pageBuilder ?? []} />
}
