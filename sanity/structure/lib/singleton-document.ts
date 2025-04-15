import type { LucideIcon } from 'lucide-react'
import type { StructureBuilder } from 'sanity/structure'

interface ISingletonDocumentStructure {
  S: StructureBuilder
  schemaType: string
  title: string
  id: string
  icon?: LucideIcon
}

export const singletonDocumentStructure = ({
  S,
  schemaType,
  title,
  id,
  icon,
}: ISingletonDocumentStructure) =>
  S.listItem()
    .title(title)
    .icon(icon)
    .child(
      S.documentList()
        .id(id)
        .title(title)
        .schemaType(schemaType)
        .filter('_type == $schemaType')
        .params({ schemaType })
        .canHandleIntent(
          (intentName: string, params: Record<string, any>) =>
            intentName === 'edit' || params.template === schemaType
        )
    )
