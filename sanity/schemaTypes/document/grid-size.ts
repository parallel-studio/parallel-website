import { Grid } from 'lucide-react'
import { defineField, defineType } from 'sanity'

export const gridSizeType = defineType({
  name: 'grid-size',
  type: 'document',
  title: 'Grid Size',
  icon: Grid,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'size',
      type: 'number',
      title: 'size',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'size',
    },
  },
})
