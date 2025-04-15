import { Footer } from '~/app/(pages)/(components)/footer'
import s from './layout.module.css'

export default function LayoutProject({
  children,
}: { children: React.ReactNode }) {
  return (
    <>
      <div className={s.layout} id="layout">
        {children}
      </div>
      <Footer />
    </>
  )
}
