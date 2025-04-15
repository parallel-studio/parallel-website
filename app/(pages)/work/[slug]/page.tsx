import { PageWrapper } from '~/app/(pages)/(components)/page-wrapper'
import { SliceMachine } from '~/intergrations/sanity/slices'
import { sanityFetch } from '~/sanity/lib/client'
import { PARALLEL_PROJECT_QUERY } from '~/sanity/queries'
import { type PARALLEL_PROJECT_QUERYResult } from '~/sanity/types'

type PageProps = {
  params: Promise<{
    slug: string
    locale: string
  }>
}

export async function generateMetadata(props: PageProps) {
  const paramsData = await props.params
  const pageData = await sanityFetch<PARALLEL_PROJECT_QUERYResult>({
    query: PARALLEL_PROJECT_QUERY,
    params: { language: 'en', slug: paramsData.slug },
  })

  return {
    title: pageData?.metaTitle || 'Parallel Studio',
    description: pageData?.metaDescription || 'Parallel Studio',
  }
}

export default async function Page(props: PageProps) {
  const paramsData = await props.params
  const pageData = await sanityFetch<PARALLEL_PROJECT_QUERYResult>({
    query: PARALLEL_PROJECT_QUERY,
    params: { language: 'en', slug: paramsData.slug },
  })

  return (
    <PageWrapper color={pageData?.color?.value}>
      <SliceMachine project={pageData} slices={pageData?.pageBuilder ?? []} />
    </PageWrapper>
  )
}
