import { Languages } from 'lucide-react'
import { defineField, defineType } from 'sanity'

import { isUniqueId } from '~/sanity/lib/utils'

export const localeType = defineType({
  name: 'locale',
  type: 'document',
  title: 'Locale',
  icon: Languages,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'id',
      type: 'string',
      title: 'Id',
      validation: (rule) =>
        rule
          .custom(async (value, context) => {
            const isUnique = await isUniqueId({
              id: value,
              context,
              type: 'locale',
              typeField: 'id',
            })
            if (!isUnique) return 'Id must be unique'
            return true
          })
          .min(2)
          .max(4),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'id',
    },
  },
})
