import { groq } from 'next-sanity'
import type { ValidationContext } from 'sanity'

import { client } from '~/sanity/lib/client'

interface IIsUniqueIdParams {
  id: string | undefined
  context: ValidationContext
  type: string
  typeField: string
}

export const isUniqueId = ({
  id,
  context,
  type,
  typeField,
}: IIsUniqueIdParams) => {
  const { document } = context

  if (!document) return true

  const documentId = document._id.replace(/^drafts\./, '')

  const params = {
    draft: `drafts.${documentId}`,
    published: documentId,
    type,
    typeField,
    id,
  }

  const query = groq`!defined(*[
    _type == $type &&
    !(_id in [$draft, $published]) &&
    $typeField == $id
  ][0]._id)`

  return client.fetch(query, params)
}

interface RemoveAllFieldsGroupProps {
  groups?: { name: string }[]
  [key: string]: any
}

export const RemoveAllFieldsGroup = (props: RemoveAllFieldsGroupProps) => {
  if (Array.isArray(props.groups) && props.groups.length > 0) {
    if (props.groups[0].name === 'all-fields') {
      props.groups.shift()
    }
  }
  return props.renderDefault(props)
}
