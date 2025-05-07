import { SliceMachine } from '~/intergrations/sanity/slices'
import { sanityFetch } from '~/sanity/lib/client'
import { PARALLEL_PAGE_QUERY } from '~/sanity/queries'
import { type PARALLEL_PAGE_QUERYResult } from '~/sanity/types'

import { useEffect } from 'react';
import { useRouter } from 'next/router';

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

  export default function WorkPage() {
    const router = useRouter();
  
    // Enregistrer la position de scroll
    useEffect(() => {
      const handleRouteChange = () => {
        sessionStorage.setItem('work-scroll', String(window.scrollY));
      };
  
      router.events.on('routeChangeStart', handleRouteChange);
      return () => {
        router.events.off('routeChangeStart', handleRouteChange);
      };
    }, [router]);
  
    // Restaurer la position de scroll
    useEffect(() => {
      const savedScroll = sessionStorage.getItem('work-scroll');
      if (savedScroll !== null) {
        const y = parseInt(savedScroll, 10);
        const interval = setInterval(() => {
          // Si la hauteur de la page est suffisante, on scroll
          if (document.body.scrollHeight > y + window.innerHeight) {
            window.scrollTo(0, y);
            clearInterval(interval);
          }
        }, 100);
        return () => clearInterval(interval);
      }
    }, []);

  return <SliceMachine slices={pageData?.pageBuilder ?? []} />
}
