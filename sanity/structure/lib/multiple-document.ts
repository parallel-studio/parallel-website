import type { LucideIcon } from 'lucide-react'
import type { StructureBuilder } from 'sanity/structure'

import { listDocumentByLanguage } from '~/sanity/structure/lib/list-document-by-language'
import type { LOCALES_QUERYResult } from '~/sanity/types'

interface IMultipleDocumentStructure {
  S: StructureBuilder
  schemaType: string
  id: string
  titles: {
    list: string
    item: string
  }
  icons: {
    list: LucideIcon
    item: LucideIcon
  }
  languages: LOCALES_QUERYResult
}

export const multipleDocumentStructure = ({
  S,
  schemaType,
  titles,
  id,
  icons,
  languages,
}: IMultipleDocumentStructure) => {
  return S.listItem()
    .title(titles.list)
    .icon(icons.list)
    .child(
      S.list()
        .title(titles.item)
        .items([
          ...languages.map((language) =>
            listDocumentByLanguage({
              S,
              language,
              schemaType,
              icon: icons.item,
            })
          ),
          S.divider(),
          S.listItem()
            .title(`All ${titles.list}`)
            .schemaType(schemaType)
            .icon(icons.item)
            .child(
              S.documentList()
                .id(id)
                .title(`All ${titles.list}`)
                .schemaType(schemaType)
                .filter('_type == $schemaType')
                .params({ schemaType })
                .canHandleIntent(
                  (intentName: string, params: Record<string, any>) =>
                    intentName === 'edit' || params.template === schemaType
                )
            ),
        ])
    )
}
