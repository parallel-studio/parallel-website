import { SliceMachine } from '~/intergrations/sanity/slices'
import { sanityFetch } from '~/sanity/lib/client'
import { PARALLEL_PAGE_QUERY } from '~/sanity/queries'
import { type PARALLEL_PAGE_QUERYResult } from '~/sanity/types'
import { ScrollRestorer } from '~/components/ScrollRestorer' // AJOUT YANN

type PageProps = {
  params: Promise<{
    slug: string
    locale: string
  }>
}

export async function generateMetadata(props: PageProps) {
  const paramsData = await props.params
  const pageData = await sanityFetch<PARALLEL_PAGE_QUERYResult>({
    query: PARALLEL_PAGE_QUERY,
    params: { language: 'en', slug: paramsData.slug },
  })

  return {
    title: pageData?.metaTitle || 'Parallel Studio',
    description: pageData?.metaDescription || 'Parallel Studio',
  }
}

export default async function Page(props: PageProps) {
  const paramsData = await props.params
  const pageData = await sanityFetch<PARALLEL_PAGE_QUERYResult>({
    query: PARALLEL_PAGE_QUERY,
    params: { language: 'en', slug: paramsData.slug },
  })

  // Modif Yann:
  // return <SliceMachine slices={pageData?.pageBuilder ?? []} />
  return (
    <>
      <ScrollRestorer />
      <SliceMachine slices={pageData?.pageBuilder ?? []} />
    </>
  )
}

//AJOUT YANN

