'use client'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import {
  type FC,
  type MouseEvent,
  type MouseEventHandler,
  useRef,
  useState,
} from 'react'
import s from './project-hero.module.css'

import cn from 'clsx'
import { ChevronDown } from 'lucide-react'
import Image from 'next/image'
import { ModalPlayer } from '~/components/modal-player'
import type { ProjectHero as IProjectHero } from '~/sanity/types'

export interface IProjectParallel {
  color: {
    value: string
  }
  Videos: {
    video_short: {
      asset: {
        playbackId: string
        data: {
          aspect_ratio: string
        }
      }
    }
    video_long: {
      asset: {
        playbackId: string
        data: {
          aspect_ratio: string
        }
      }
    }
  }
  details: {
    title: string
    description: string
    customer: string
    expertise: string
  }
}
export interface ProjectHeroProps
  extends Pick<IProjectHero, '_type' | 'layout' | 'muxPlaceholderTimestamp'> {
  project: IProjectParallel
  video: keyof IProjectParallel['Videos']
}

export const ProjectHero: FC<ProjectHeroProps> = ({
  layout,
  video,
  muxPlaceholderTimestamp,
  project,
}) => {
  const videoId = project?.Videos?.[video]?.asset.playbackId ?? null
  const loadedCountRef = useRef(0)
  const [showModal, setShowModal] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const containerVideoRef = useRef<HTMLDivElement>(null)
  const containerWRapperVideoRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<any>(null)

  const [tl, setTl] = useState<any>(null)

  const { contextSafe } = useGSAP(() => {
    const tl = gsap.timeline({
      reversed: true,
    })
    tl.to(containerRef.current, {
      opacity: 0,
      duration: 0.75,
      ease: 'power2.out',
      pointerEvents: 'auto',
    })
    tl.set(containerVideoRef.current, {
      position: 'fixed',
      zIndex: 9999,
      top: '0',
      left: '0',
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    })
    tl.set(containerWRapperVideoRef.current, {
      pointerEvents: 'none',
    })
    tl.set(videoRef.current, {
      pointerEvents: 'auto',
      zIndex: 9999,
    })
    tl.to(containerRef.current, {
      opacity: 1,
      duration: 0.75,
      ease: 'power2.out',
      pointerEvents: 'auto',
    })

    setTl(tl)
  })

  const handleClick: MouseEventHandler<HTMLDivElement> = contextSafe(
    (event: MouseEvent<HTMLDivElement>) => {
      setShowModal(true)
      // event.stopPropagation();
      // tl.reversed(!tl.reversed());
    }
  )

  const handleCloseModal = () => {
    setShowModal(false)
  }

  return (
    <section
      className={cn(
        s.project_hero,
        s[`layout__${layout}`],
        'pb-safe px-safe bg-primary text-secondary'
      )}
      ref={containerRef}
    >
      <div className="flex flex-col justify-end mt-safe gap-safe ">
        <div className="flex flex-col dr-max-w-650 gap-safe">
          <h2 className="text-large leading-[1.15] font-light text-wrap-pretty">
            <span style={{ color: project?.color?.value }}>
              {project?.details?.title}
            </span>{' '}
            {project?.details?.description}
            <div className="inline-block sm:hidden">
              <ChevronDown className="relative inline-block top-[0.55ch] dr-ml-5" />
            </div>
          </h2>

          <div className="flex flex-row dr-gap-20">
            <div className="flex flex-col dr-gap-5">
              <span
                className="text-tag-label uppercase leading-[1.15] text-wrap-pretty"
                style={{ color: project?.color?.value }}
              >
                Client
              </span>
              <span className="text-xsmall leading-[0.5]">
                {project?.details?.customer.toUpperCase()}
              </span>
            </div>
            <div className="flex flex-col dr-gap-5">
              <span
                className="text-tag-label uppercase leading-[1.15] text-wrap-pretty"
                style={{ color: project?.color?.value }}
              >
                Expertise
              </span>
              <span className="text-xsmall leading-[0.5]">
                {project?.details?.expertise}
              </span>
            </div>
          </div>
        </div>

        <div className="hidden lg:block">
          <ChevronDown className="relative inline-block top-[0.55ch] dr-ml-5" />
        </div>
      </div>

      <div
        className="relative cursor-pointer overflow-hidden h-full"
        onClick={handleClick}
      >
        <div className="w-auto h-full relative">
          <Image
            fill
            src={`https://image.mux.com/${videoId}/thumbnail.png?time=${muxPlaceholderTimestamp ?? 0}`}
            alt={project?.details?.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 dr-h-50 dr-w-50">
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path
                d="m6.73 20.93 14.05-8.54a.46.46 0 0 0 0-.78L6.73 3.07a.48.48 0 0 0-.73.39v17.07a.48.48 0 0 0 .73.4Z"
                fill="white"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      {showModal && (
        <ModalPlayer
          videoId={videoId}
          color={project.color.value}
          onClose={handleCloseModal}
          aspectRatio={project?.Videos?.[video]?.asset?.data?.aspect_ratio}
        />
      )}
    </section>
  )
}
