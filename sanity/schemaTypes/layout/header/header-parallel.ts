import { defineField, defineType } from 'sanity'

import { languageFields } from '~/sanity/fields'
import { linkAdditionalFields, linkField } from '~/sanity/fields/link'
import { pageTypes } from '~/sanity/lib/schemaTypes'

export const headerParallelType = defineType({
  name: 'header-parallel',
  type: 'document',
  title: 'Header Parallel',
  fields: [
    ...languageFields,
    defineField({
      name: 'links',
      type: 'array',
      title: 'Links',
      of: [
        linkField({
          types: [pageTypes.PAGE_PARALLEL],
          additionalFields: [linkAdditionalFields.TITLE],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      language: 'language',
    },
    prepare({ language }) {
      return {
        title: language,
      }
    },
  },
})
