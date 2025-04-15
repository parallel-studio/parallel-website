import { File } from 'lucide-react'
import { defineType } from 'sanity'

import { languageFields, pageBuilderFields, seoFields } from '~/sanity/fields'
import { GroupType, createGroups } from '~/sanity/lib/groups'

export const pageParallelType = defineType({
  name: 'page-parallel',
  type: 'document',
  title: 'Page',
  icon: File,
  groups: createGroups({
    types: [GroupType.CONTENT, GroupType.SEO],
    defaultGroup: GroupType.CONTENT,
  }),
  fields: [
    ...languageFields,
    ...pageBuilderFields({ group: GroupType.CONTENT }),
    ...seoFields({ withSlug: true }),
  ],
  preview: {
    select: {
      title: 'metaTitle',
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
