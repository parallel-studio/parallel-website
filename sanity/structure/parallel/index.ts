import {
  AlignEndHorizontal,
  AlignStartHorizontal,
  BookOpen,
  File,
  House,
  ScrollText,
} from 'lucide-react'
import type { StructureBuilder } from 'sanity/structure'

import { TiFlowParallel } from 'react-icons/ti'
import { multipleDocumentStructure } from '~/sanity/structure/lib/multiple-document'
import type { LOCALES_QUERYResult } from '~/sanity/types'

interface IParallelStructure {
  S: StructureBuilder
  languages: LOCALES_QUERYResult
}

export const parallelStructure = ({ S, languages }: IParallelStructure) => {
  return S.listItem()
    .title('Parallel')
    .icon(TiFlowParallel)
    .child(
      S.list()
        .title('Parallel')
        .items([
          multipleDocumentStructure({
            S,
            schemaType: 'home-page-parallel',
            titles: {
              list: 'Home Pages',
              item: 'Home Page',
            },
            id: 'all-pages-home-parallel',
            icons: {
              list: House,
              item: File,
            },
            languages,
          }),
          multipleDocumentStructure({
            S,
            schemaType: 'page-parallel',
            titles: {
              list: 'Pages',
              item: 'Page',
            },
            id: 'all-pages-parallel',
            icons: {
              list: BookOpen,
              item: File,
            },
            languages,
          }),
          multipleDocumentStructure({
            S,
            schemaType: 'project-parallel',
            titles: {
              list: 'Projects',
              item: 'Project',
            },
            id: 'all-projects-parallel',
            icons: {
              list: ScrollText,
              item: File,
            },
            languages,
          }),
          multipleDocumentStructure({
            S,
            schemaType: 'header-parallel',
            titles: {
              list: 'Headers',
              item: 'Header',
            },
            id: 'all-header-parallels',
            icons: {
              list: AlignStartHorizontal,
              item: File,
            },
            languages,
          }),
          multipleDocumentStructure({
            S,
            schemaType: 'footer-parallel',
            titles: {
              list: 'Footers',
              item: 'Footer',
            },
            id: 'all-footers-parallels',
            icons: {
              list: AlignEndHorizontal,
              item: File,
            },
            languages,
          }),
        ])
    )
}
