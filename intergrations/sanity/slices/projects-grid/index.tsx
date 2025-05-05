'use client'
import cn from 'clsx'
import { type FC, useEffect, useMemo, useRef, useState } from 'react'
import type {
  ProjectsGrid as IProjectsGrid,
  ProjectParallel,
} from '~/sanity/types'
import { GridItem } from './components/grid-item/index'
import { useScrollRestoration } from './hooks/useScrollRestoration'
import s from './projects-grid.module.css'

export interface IProjectParallel {
  color: {
    value: string
  }
  Videos: {
    video_short: {
      asset: {
        playbackId: string
      }
    }
    video_long: {
      asset: {
        playbackId: string
      }
    }
    video_grid: {
      asset: {
        playbackId: string
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

export interface ProjectsGridProps extends Pick<IProjectsGrid, '_type'> {
  projects: {
    muxPlaceholderTimestamp: string
    video: keyof IProjectParallel['Videos']
    size: {
      title: string
      size: number
    }
    project: IProjectParallel &
      Omit<ProjectParallel, 'color' | 'Videos' | 'details'>
    autoPlay?: boolean
    playOnHover?: boolean
    lazyLoad?: boolean
    preloadVideo?: 'none' | 'metadata' | 'auto'
  }[]
}

export const ProjectsGrid: FC<ProjectsGridProps> = ({ projects }) => {
  // Créez une MAP stable pour suivre ce qui a déjà été chargé - SUPPRIMÉ
  // const loadedProjectsMap = useRef(new Map()).current
  const [visibleProjects, setVisibleProjects] = useState<
    ((typeof projects)[0] & { absoluteIndex: number })[]
  >([])
  const [targetCount, setTargetCount] = useState(0) // Nouvel état pour suivre le nombre cible
  const ITEMS_PER_BATCH = 8

  const containerRef = useRef<HTMLDivElement>(null)
  const loaderRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Transformer les projets une seule fois avec leurs indices
  const projectsWithIndices = useMemo(
    () =>
      projects.map((project, index) => ({
        ...project,
        absoluteIndex: index,
      })),
    [projects]
  )


  // AJOUT YANN
  useEffect(() => {
    const savedScrollY = typeof window !== 'undefined'
      ? sessionStorage.getItem('scrollY:/')
      : null
  
    if (savedScrollY) {
      const scrollY = parseInt(savedScrollY, 10)
      // Estime combien d’items il faut charger pour que scrollY soit atteignable
      const estimatedItemsToLoad = Math.ceil(scrollY / 600) + 4
      const count = Math.min(estimatedItemsToLoad, projectsWithIndices.length)
  
      setTargetCount(count)
    } else {
      setTargetCount(Math.min(ITEMS_PER_BATCH, projectsWithIndices.length))
    }
  }, [projectsWithIndices])
  useEffect(() => {
    const savedScrollY = typeof window !== 'undefined'
      ? sessionStorage.getItem('scrollY:/')
      : null
  
    if (savedScrollY && visibleProjects.length >= targetCount) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedScrollY, 10))
        sessionStorage.removeItem('scrollY:/')
      }, 50)
    }
  }, [visibleProjects, targetCount])


/*
  // Chargement initial
  useEffect(() => {
    const initialCount = Math.min(ITEMS_PER_BATCH, projectsWithIndices.length)
    setTargetCount(initialCount)
  }, [projectsWithIndices])
*/

  // Mise à jour de visibleProjects basée sur targetCount
  useEffect(() => {
    setVisibleProjects(projectsWithIndices.slice(0, targetCount))
  }, [targetCount, projectsWithIndices])


  // Observer pour le chargement à la demande
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const target = entries[0]
        if (
          target.isIntersecting &&
          targetCount < projectsWithIndices.length // Utilise targetCount ici
        ) {
          // Déterminer le prochain nombre cible d'éléments à afficher
          const nextTargetCount = Math.min(
            targetCount + ITEMS_PER_BATCH,
            projectsWithIndices.length
          )
          setTargetCount(nextTargetCount) // Met à jour le nombre cible
        }
      },
      {
        root: null,
        rootMargin: '300px', // Augmenter encore plus pour précharger
        threshold: 0.1,
      }
    )

    if (loaderRef.current) {
      observerRef.current.observe(loaderRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [targetCount, projectsWithIndices]) // Dépend de targetCount

  const handleVideoLoaded = () => {
    // Fonction de callback pour le chargement vidéo
  }

  return (
    <section
      className={cn(s.projects_grid, 'p-safe bg-primary text-secondary')}
      ref={containerRef}
    >
      <div className={s.projects_grid__row}>
        {visibleProjects?.map((projectItem) => {
          const {
            project,
            size,
            muxPlaceholderTimestamp,
            video,
            autoPlay,
            lazyLoad,
            absoluteIndex,
          } = projectItem || {}
          if (!project) return null

          const playbackId = project?.Videos?.[video]?.asset?.playbackId
          if (!playbackId) return null

          // Utiliser une clé 100% unique combinant l'ID et l'index
          const uniqueKey = `project-${playbackId}-${absoluteIndex}`

          return (
            <GridItem
              style={{
                width: `calc(${size.size}% - var(--safe))`,
                flexGrow: 1,
              }}
              slug={project?.slug?.current || ''}
              key={uniqueKey}
              className={`${s.grid__item}`}
              title={project.details?.customer || ''}
              description={project.details?.title || ''}
              index={absoluteIndex}
              color={project.color?.value || ''}
              video={playbackId}
              muxPlaceholderTimestamp={muxPlaceholderTimestamp || ''}
              onVideoLoaded={handleVideoLoaded}
              autoPlay={autoPlay}
              lazyLoad={lazyLoad !== false}
            />
          )
        })}
      </div>
      {targetCount < projectsWithIndices.length && ( // Utilise targetCount ici
        <div ref={loaderRef} style={{ height: '20px', margin: '20px 0' }} />
      )}
    </section>
  )
}
