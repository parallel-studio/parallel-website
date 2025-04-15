'use client'
import cn from 'clsx'
import { TransitionLink } from '~/components/link'
import { useSanityContext } from '~/intergrations/sanity/context'
import { FooterParallaxClient } from './client'
import s from './footer.module.css'
// @ts-ignore
export const Footer = ({ from }: { from?: 'work' | 'home' }) => {
  const { data } = useSanityContext()
  if (!data.footer) return null

  return (
    <footer className={cn(s.footer, 'bg-secondary text-primary')} id="footer">
      <FooterParallaxClient>
        <div className={s.wrapper}>
          <TransitionLink
            slug={'work'}
            className={cn(s.link, from === 'work' && s.link__hidden)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              width="1em"
              height="1em"
            >
              <path
                fill="currentColor"
                d="M12.7 244.7L1.4 256l11.3 11.3 168 168L192 446.6 214.6 424l-11.3-11.3L62.6 272 432 272l16 0 0-32-16 0L62.6 240 203.3 99.3 214.6 88 192 65.4 180.7 76.7l-168 168z"
              />
            </svg>
            <span>All projects</span>
          </TransitionLink>
          <div className={s.connect}>
            <div className={s.connect__title}>Connect</div>
            <ul className={s.connect__links}>
              {data.footer?.links?.map((link: any, index: any) => {
                return (
                  <li key={index}>
                    <TransitionLink className={s.connect__link} {...link}>
                      {link.title}
                    </TransitionLink>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </FooterParallaxClient>

      <p className={s.legal}>All rights reserved © Parallel Studio</p>
    </footer>
  )
}
