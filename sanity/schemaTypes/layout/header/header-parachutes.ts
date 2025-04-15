import { defineField, defineType } from 'sanity'

import { languageFields, linkField } from '~/sanity/fields'
import { pageTypes } from '~/sanity/lib/schemaTypes'

export const headerParachutesType = defineType({
  name: 'header-parachutes',
  type: 'document',
  title: 'Header Parachutes',
  fields: [
    ...languageFields,
    defineField({
      name: 'links',
      type: 'array',
      title: 'Links',
      of: [
        linkField({
          types: [pageTypes.PAGE_PARACHUTES],
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
