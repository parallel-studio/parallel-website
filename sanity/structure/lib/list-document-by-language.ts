import { Languages, type LucideIcon } from 'lucide-react'
import type { StructureBuilder } from 'sanity/structure'

import type { LOCALES_QUERYResult } from '~/sanity/types'

interface IlistDocumentByLanguage {
  S: StructureBuilder
  language: LOCALES_QUERYResult[number]
  schemaType: string
  icon: LucideIcon
}

export const listDocumentByLanguage = ({
  S,
  language,
  schemaType,
  icon,
}: IlistDocumentByLanguage) => {
  return S.listItem()
    .title(`${language.title} (${language.id})`)
    .schemaType(schemaType)
    .icon(Languages)
    .child(
      S.documentList()
        .id(language.id || '')
        .title(`${language.title}`)
        .schemaType(schemaType)
        .filter('_type == $schemaType && language == $language')
        .params({ language: language.id, schemaType })
        .initialValueTemplates([
          S.initialValueTemplateItem(`${schemaType}-language`, {
            id: `${schemaType}-language`,
            language: language.id,
          }),
        ])
        .canHandleIntent((intentName: string, params: Record<string, any>) => {
          if (intentName === 'edit') {
            return false
          }
          if (!params.template) {
            return true
          }
          const languageValue = params.template?.split('-').pop()
          return languageValue === language.id
        })
    )
}
