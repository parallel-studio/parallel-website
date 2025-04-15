import { defineField, defineType } from 'sanity'

import {
  linkAdditionalFields,
  linkField,
  richTextContentField,
} from '~/sanity/fields'
import { pageTypes } from '~/sanity/lib/schemaTypes'

export const aboutSectionType = defineType({
  name: 'about-section',
  type: 'object',
  title: 'About Section',
  groups: [
    { name: 'links', title: 'Links', default: true },
    { name: 'content', title: 'Content' },
    { name: 'bottomContent', title: 'Bottom Content' },
  ],
  fields: [
    defineField({
      name: 'links',
      type: 'array',
      title: 'Links',
      group: 'links',
      of: [
        linkField({
          types: [pageTypes.PAGE_PARALLEL],
          additionalFields: [linkAdditionalFields.TITLE],
        }),
      ],
    }),
    richTextContentField({
      group: 'content',
      name: 'content',
      title: 'Content',
    }),
    linkField({
      fieldName: 'linkContent',
      fieldTitle: 'Link Content',
      group: 'content',
      types: [pageTypes.PAGE_PARALLEL],
      additionalFields: [linkAdditionalFields.TITLE],
    }),
    defineField({
      group: 'content',
      name: 'jobs',
      type: 'array',
      title: 'Jobs',
      of: [
        defineField({
          name: 'job',
          type: 'object',
          title: 'Job',
          fields: [
            defineField({
              name: 'title',
              type: 'string',
              title: 'Title',
            }),
            linkField({
              types: [pageTypes.PAGE_PARALLEL],
              additionalFields: [linkAdditionalFields.TITLE],
            }),
          ],
        }),
      ],
    }),

    richTextContentField({
      group: 'bottomContent',
      name: 'bottomContentLeft',
      title: 'Bottom Content left',
    }),
    richTextContentField({
      group: 'bottomContent',
      name: 'bottomContentRight',
      title: 'Bottom Content right',
    }),
  ],
  preview: {
    prepare() {
      const sliceType = 'About Section'
      return {
        title: `${sliceType}`,
      }
    },
  },
})
