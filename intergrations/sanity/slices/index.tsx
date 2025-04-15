import type { FC } from 'react'

import type {
  PARALLEL_HOME_PAGE_QUERYResult,
  PARALLEL_PROJECT_QUERYResult,
  RichText as RichTextProps,
} from '~/sanity/types'

import { AboutSection, type AboutSectionProps } from './about-section'
import {
  CustomColumnImageGrid,
  type CustomColumnImageGridProps,
} from './custom-column-image-grid'
import {
  CustomColumnMediaGrid,
  type CustomColumnMediaGridProps,
} from './custom-column-media-grid'
import {
  FullScreenInfiniteProjectSlider,
  type FullScreenInfiniteProjectSliderProps,
} from './full-screen-infinite-project-slider'
import { FullWidthVideo, type FullWidthVideoProps } from './full-width-video'
import { ProjectHero, type ProjectHeroProps } from './project-hero'
import { ProjectsGrid, type ProjectsGridProps } from './projects-grid'
import { RichText } from './rich-text'
import {
  TwoColumnTextImage,
  type TwoColumnTextImageProps,
} from './two-column-text-image'
export type ComponentMapType = {
  'about-section': FC<AboutSectionProps>
  'full-screen-infinite-project-slider': FC<FullScreenInfiniteProjectSliderProps>
  'project-hero': FC<ProjectHeroProps>
  'custom-column-image-grid': FC<CustomColumnImageGridProps>
  'custom-column-media-grid': FC<CustomColumnMediaGridProps>
  'projects-grid': FC<ProjectsGridProps>
  richText: FC<RichTextProps>
  'two-column-text-image': FC<TwoColumnTextImageProps>
  'full-width-video': FC<FullWidthVideoProps>
}

export const componentMap: ComponentMapType = {
  'full-screen-infinite-project-slider': FullScreenInfiniteProjectSlider,
  'project-hero': ProjectHero,
  'custom-column-image-grid': CustomColumnImageGrid,
  'custom-column-media-grid': CustomColumnMediaGrid,
  'projects-grid': ProjectsGrid,
  richText: RichText,
  'two-column-text-image': TwoColumnTextImage,
  'full-width-video': FullWidthVideo,
  'about-section': AboutSection,
}

interface SliceMachineProps {
  slices: NonNullable<PARALLEL_HOME_PAGE_QUERYResult>['pageBuilder']
  project?: PARALLEL_PROJECT_QUERYResult
}

export const SliceMachine: FC<SliceMachineProps> = ({ slices, project }) => {
  if (!slices) return null
  return (
    <>
      {slices.map((section, index) => {
        const SectionComponent =
          componentMap[section._type as keyof ComponentMapType]
        if (SectionComponent) {
          return (
            <SectionComponent
              key={index}
              {...(section as any)}
              project={project}
            />
          )
        }
        return null
      })}
    </>
  )
}
