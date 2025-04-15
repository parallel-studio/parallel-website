'use client'
import cn from 'clsx'
import { type FC, useEffect, useMemo, useRef, useState } from 'react'
import type {
  ProjectsGrid as IProjectsGrid,
  ProjectParallel,
} from '~/sanity/types'
import { GridItem } from './components/grid-item/index'
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
  // Créer une MAP stable pour suivre ce qui a déjà été chargé
  const loadedProjectsMap = useRef(new Map()).current
  const [visibleProjects, setVisibleProjects] = useState<
    ((typeof projects)[0] & { absoluteIndex: number })[]
  >([])
  const [currentIndex, setCurrentIndex] = useState(0)
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

  // Chargement initial
  useEffect(() => {
    const initialBatch = projectsWithIndices.slice(0, ITEMS_PER_BATCH)

    // Ajouter chaque projet à notre map de suivi
    initialBatch.forEach((project) => {
      const playbackId =
        project.project?.Videos?.[project.video]?.asset?.playbackId
      if (playbackId) {
        const key = `${playbackId}-${project.absoluteIndex}`
        loadedProjectsMap.set(key, true)
      }
    })

    setVisibleProjects(initialBatch)
    setCurrentIndex(ITEMS_PER_BATCH)
  }, [projectsWithIndices, loadedProjectsMap])

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
          currentIndex < projectsWithIndices.length
        ) {
          // Déterminer le prochain lot à charger
          const nextBatch = projectsWithIndices.slice(
            currentIndex,
            currentIndex + ITEMS_PER_BATCH
          )

          // Filtrer les projets déjà chargés pour éviter les doublons
          const newBatch = nextBatch.filter((project) => {
            const playbackId =
              project.project?.Videos?.[project.video]?.asset?.playbackId
            if (!playbackId) return false

            const key = `${playbackId}-${project.absoluteIndex}`
            if (loadedProjectsMap.has(key)) {
              return false // Déjà chargé, ne pas ajouter à nouveau
            }

            // Marquer comme chargé
            loadedProjectsMap.set(key, true)
            return true
          })

          if (newBatch.length > 0) {
            setVisibleProjects((prev) => [...prev, ...newBatch])
          }

          setCurrentIndex((prev) => prev + ITEMS_PER_BATCH)
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
  }, [currentIndex, projectsWithIndices, loadedProjectsMap])

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
      {currentIndex < projectsWithIndices.length && (
        <div ref={loaderRef} style={{ height: '20px', margin: '20px 0' }} />
      )}
    </section>
  )
}
