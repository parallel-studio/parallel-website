import { BookOpen, File, House, List } from 'lucide-react'
import { TbParachute } from 'react-icons/tb'
import type { StructureBuilder } from 'sanity/structure'

import { multipleDocumentStructure } from '~/sanity/structure/lib/multiple-document'
import { singletonDocumentStructure } from '~/sanity/structure/lib/singleton-document'
import type { LOCALES_QUERYResult } from '~/sanity/types'

interface IParachuteStructure {
  S: StructureBuilder
  languages: LOCALES_QUERYResult
}

export const parachuteStructure = ({ S, languages }: IParachuteStructure) => {
  return S.listItem()
    .title('Parachutes')
    .icon(TbParachute)
    .child(
      S.list()
        .title('Parachutes')
        .items([
          singletonDocumentStructure({
            S,
            schemaType: 'home-page-parachutes',
            title: 'Home Page',
            id: 'home-page-parachutes',
            icon: House,
          }),
          multipleDocumentStructure({
            S,
            schemaType: 'page-parachutes',
            titles: {
              list: 'Pages',
              item: 'Page',
            },
            id: 'all-pages-parachutes',
            icons: {
              list: BookOpen,
              item: File,
            },
            languages,
          }),
          multipleDocumentStructure({
            S,
            schemaType: 'project-parachutes',
            titles: {
              list: 'Projects',
              item: 'Project',
            },
            id: 'all-projects-parachutes',
            icons: {
              list: BookOpen,
              item: File,
            },
            languages,
          }),
          singletonDocumentStructure({
            S,
            schemaType: 'header-parachutes',
            title: 'Header',
            id: 'all-header-parachutes',
            icon: List,
          }),
          singletonDocumentStructure({
            S,
            schemaType: 'footer-parachutes',
            title: 'Footer',
            id: 'all-footers-parachutes',
            icon: List,
          }),
        ])
    )
}
