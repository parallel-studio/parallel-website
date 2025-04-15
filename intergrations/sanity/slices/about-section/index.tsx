'use client'
import cn from 'clsx'
import type { FC } from 'react'
import { TransitionLink } from '~/components/link'
import { PortableTextComponent } from '~/components/portable-text'
import type { AboutSection as IAboutSection } from '~/sanity/types'
import s from './about-section.module.css'
export interface AboutSectionProps
  extends Pick<
    IAboutSection,
    | '_type'
    | 'content'
    | 'linkContent'
    | 'links'
    | 'bottomContentLeft'
    | 'bottomContentRight'
    | 'jobs'
  > {}

export const AboutSection: FC<AboutSectionProps> = ({
  links,
  content,
  bottomContentLeft,
  bottomContentRight,
  jobs,
  linkContent,
}) => {
  if (!content) return null

  return (
    <div className={cn('px-safe bg-primary text-secondary', s.about)}>
      <div className={s.about_section}>
        <div className={s.wrapper}>
          <div className={s.connect}>
            <div className={s.connect__title}>Connect</div>
            <ul className={s.connect__links}>
              {links?.map((link, index) => {
                return (
                  <li key={index}>
                    <TransitionLink {...link}>{link.title}</TransitionLink>
                  </li>
                )
              })}
            </ul>
          </div>
          <div className={s.content}>
            <PortableTextComponent content={content} />
            {linkContent && (
              <div>
                <TransitionLink {...linkContent} className={s.link_content}>
                  <span>{linkContent.title}</span>
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
                </TransitionLink>
              </div>
            )}
            <div className={s.jobs}>
              {jobs?.map((job, index) => {
                return (
                  <div key={index} className={s.job}>
                    <div className={s.job__title}>{job.title}</div>
                    <TransitionLink {...job.link} className={s.job__link}>
                      <span>{job.link?.title}</span>
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
                    </TransitionLink>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
      <div className={cn(s.bottom_content, 'bg-secondary text-primary')}>
        <div className={s.bottom_content__wrapper}>
          <div className={s.bottom_content__left} />
          <div className={s.bottom_content__right}>
            <PortableTextComponent content={bottomContentLeft} />
            <PortableTextComponent content={bottomContentRight} />
          </div>
        </div>
      </div>
    </div>
  )
}
