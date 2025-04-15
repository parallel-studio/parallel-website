import type {
  DefaultDocumentNodeResolver,
  StructureBuilder,
} from 'sanity/structure'

import { client } from '~/sanity/lib/client'
import { parachuteStructure } from '~/sanity/structure/parachutes'
import { parallelStructure } from '~/sanity/structure/parallel'
import { settingsStructure } from '~/sanity/structure/settings'
import type { LOCALES_QUERYResult } from '~/sanity/types'

export const structure = async (S: StructureBuilder) => {
  const languages: LOCALES_QUERYResult = await client.fetch(
    '*[_type == "locale"] { id, title }'
  )
  return S.list()
    .title('Main')
    .items([
      settingsStructure(S),
      parallelStructure({ S, languages }),
      parachuteStructure({ S, languages }),
    ])
}

export const defaultDocumentNode: DefaultDocumentNodeResolver = (
  S,
  { schemaType }
) => {
  switch (schemaType) {
    case 'page':
      return S.document().views([S.view.form()])
    case 'footer':
      return S.document().views([S.view.form()])
    default:
      return S.document()
  }
}
