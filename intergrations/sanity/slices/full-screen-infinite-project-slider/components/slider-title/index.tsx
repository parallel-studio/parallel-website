import { useGSAP } from '@gsap/react'
import cn from 'clsx'
import gsap from 'gsap'
import { Fragment, useEffect, useRef } from 'react'
import { PortableTextComponent } from '~/components/portable-text'
import { useSliderStore } from '../../store/use-slider-store'
import s from './title.module.css'
gsap.registerPlugin(useGSAP)

interface TitleProps {
  defaultTitle: any
  projects: Array<{
    _type: 'item' | 'project'
    details?: {
      title?: string
      description?: string
      customer?: string
      expertise?: string
    }
    tagLabel?: string
    tag?: string
    color?: {
      value: string
    }
    Videos?: {
      video_short?: {
        asset?: {
          playbackId: string
        }
      }
    }
    muxPlaceholderTimestamp?: string
  }>
}

export const Title = ({ defaultTitle, projects }: TitleProps) => {
  const { hoveredIndex } = useSliderStore()
  const defaultTitleRef = useRef<HTMLDivElement>(null)
  const titleContainerRef = useRef<HTMLDivElement>(null)
  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([])
  const bottomRefs = useRef<(HTMLDivElement | null)[]>([])
  const animationsRef = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    titleRefs.current = titleRefs.current.slice(0, projects.length)
    bottomRefs.current = bottomRefs.current.slice(0, projects.length)
  }, [projects.length])

  useGSAP(
    () => {
      if (animationsRef.current) {
        animationsRef.current.kill()
      }
      animationsRef.current = gsap.timeline()

      animationsRef.current.to(
        [
          defaultTitleRef.current,
          ...titleRefs.current.filter(Boolean),
          ...bottomRefs.current.filter(Boolean),
        ],
        {
          opacity: 0,
          duration: 0.25,
          ease: 'power2.out',
        }
      )

      if (hoveredIndex === null) {
        animationsRef.current.to(defaultTitleRef.current, {
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
        })
      } else if (hoveredIndex >= 0 && hoveredIndex < projects.length) {
        const titleElement = titleRefs.current[hoveredIndex]
        const bottomElement = bottomRefs.current[hoveredIndex]

        if (titleElement && bottomElement) {
          animationsRef.current.to([titleElement, bottomElement], {
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out',
          })
        }
      }
    },
    { dependencies: [hoveredIndex, projects.length] }
  )

  return (
    <div
      className={cn(s.title_container, 'max-w-[85%]')}
      ref={titleContainerRef}
    >
      <div
        className={cn(s.title, s.title__wrapper, s.main_title, 'opacity-0')}
        ref={defaultTitleRef}
      >
        {typeof defaultTitle === 'string' ? (
          <h2>{defaultTitle}</h2>
        ) : (
          <PortableTextComponent content={defaultTitle} />
        )}
      </div>

      {projects?.map((projectData, index) => {
        const { _type } = projectData
        const titleColor = projectData?.color?.value

        return (
          <Fragment key={`title-${index}`}>
            <h2
              ref={(el) => {
                titleRefs.current[index] = el
              }}
              className={cn(
                s.title,
                s.title__wrapper,
                s.main_title,
                'opacity-0'
              )}
              data-index={String(index)}
            >
              {
                <>
                  <span style={{ color: titleColor }}>
                    {projectData?.details?.title}
                  </span>{' '}
                  {projectData?.details?.description && (
                    <span className={s.title__description}>
                      {projectData?.details?.description}
                    </span>
                  )}
                </>
              }
            </h2>

            <div
              ref={(el) => {
                bottomRefs.current[index] = el
              }}
              className={cn(s.title__wrapper, s.title__bottom, 'opacity-0')}
              data-index={String(index)}
            >
              <div className={s.title__infos}>
                {_type === 'item' ? (
                  <>
                    <span className={s.title__infos__title}>
                      {projectData.tagLabel}
                    </span>
                    <span>{projectData.tag}</span>
                  </>
                ) : (
                  <>
                    <span
                      className={s.title__infos__title}
                      style={{ color: titleColor }}
                    >
                      Client
                    </span>
                    <span>{projectData?.details?.customer}</span>
                  </>
                )}
              </div>
              {_type === 'project' && (
                <div className={s.title__infos}>
                  <span
                    className={s.title__infos__title}
                    style={{ color: titleColor }}
                  >
                    Expertise
                  </span>
                  <span>{projectData?.details?.expertise}</span>
                </div>
              )}
            </div>
          </Fragment>
        )
      })}
    </div>
  )
}
