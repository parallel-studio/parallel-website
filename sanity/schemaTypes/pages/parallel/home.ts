import { File } from 'lucide-react'
import { defineType } from 'sanity'

import { languageFields, pageBuilderFields, seoFields } from '~/sanity/fields'
import { GroupType, createGroups } from '~/sanity/lib/groups'

export const homePageParallelType = defineType({
  name: 'home-page-parallel',
  type: 'document',
  title: 'Home Page',
  icon: File,
  groups: createGroups({
    types: [GroupType.CONTENT, GroupType.SEO],
    defaultGroup: GroupType.CONTENT,
  }),
  fields: [
    ...languageFields,
    ...pageBuilderFields({ group: GroupType.CONTENT }),
    ...seoFields({ withSlug: false }),
  ],
  preview: {
    select: {
      title: 'languageTitle',
      subtitle: 'language',
    },
    prepare({ title, subtitle }) {
      return {
        title: `${title || 'Home'}`,
        subtitle: `${subtitle || 'Untitled'}`,
      }
    },
  },
})
