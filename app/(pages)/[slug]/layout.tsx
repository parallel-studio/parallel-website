import { Footer } from '~/app/(pages)/(components)/footer'
import s from './layout.module.css'

type PageProps = {
  children: React.ReactNode
  params: Promise<{
    slug: string
    locale: string
  }>
}

export default async function Layout({ children, params }: PageProps) {
  const { slug } = await params
  return (
    <>
      <div className={s.layout} id="layout">
        {children}
      </div>
      {slug === 'work' && <Footer from="work" />}
    </>
  )
}
