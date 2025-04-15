import { defineField, defineType } from 'sanity'

import { languageFields } from '~/sanity/fields'
import { linkField } from '~/sanity/fields/link'
import { pageTypes } from '~/sanity/lib/schemaTypes'

export const footerParachutesType = defineType({
  name: 'footer-parachutes',
  type: 'document',
  title: 'Footer',
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
      title: 'languageTitle',
      subtitle: 'language',
    },
    prepare({ title, subtitle }) {
      return {
        title: `${title || 'Untitled'}`,
        subtitle: `${subtitle || 'Untitled'}`,
      }
    },
  },
})
