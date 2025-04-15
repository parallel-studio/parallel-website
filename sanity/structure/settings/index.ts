import { Settings } from 'lucide-react'
import type { StructureBuilder } from 'sanity/structure'

import { singletonDocumentStructure } from '~/sanity/structure/lib/singleton-document'

export const settingsStructure = (S: StructureBuilder) =>
  S.listItem()
    .title('Settings')
    .icon(Settings)
    .child(
      S.list()
        .title('Settings')
        .items([
          singletonDocumentStructure({
            S,
            schemaType: 'locale',
            title: 'Languages',
            id: 'languages',
          }),
          singletonDocumentStructure({
            S,
            schemaType: 'grid-size',
            title: 'Grid Sizes',
            id: 'grid-sizes',
          }),
        ])
    )
