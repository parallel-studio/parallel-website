import { defineField, defineType } from 'sanity'

import { languageFields, linkAdditionalFields } from '~/sanity/fields'
import { linkField } from '~/sanity/fields/link'
import { pageTypes } from '~/sanity/lib/schemaTypes'

export const footerParallelType = defineType({
  name: 'footer-parallel',
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
          types: [pageTypes.PAGE_PARALLEL],
          additionalFields: [linkAdditionalFields.TITLE],
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
        title: `Footer`,
        subtitle: `${subtitle || 'Untitled'}`,
      }
    },
  },
})
