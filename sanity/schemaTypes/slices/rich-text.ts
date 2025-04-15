import { defineType } from 'sanity'

import { richTextContentField } from '~/sanity/fields'
import { getBlockText } from '~/sanity/lib/preview-rich-text'

export const richTextType = defineType({
  name: 'richText',
  type: 'object',
  title: 'Rich Text',
  fields: [
    richTextContentField({
      name: 'content',
      title: 'Content',
    }),
  ],
  preview: {
    select: {
      title: 'content',
    },
    prepare({ title }) {
      const sliceType = 'Rich Text'
      const blockText = getBlockText(title)
      return {
        title: `${sliceType}`,
        subtitle: `${blockText || 'Untitled'}`,
      }
    },
  },
})
