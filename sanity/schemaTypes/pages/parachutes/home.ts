import { File } from 'lucide-react'
import { defineType } from 'sanity'

import { languageFields, pageBuilderFields, seoFields } from '~/sanity/fields'
import { GroupType, createGroups } from '~/sanity/lib/groups'

export const homePageParachutesType = defineType({
  name: 'home-page-parachutes',
  type: 'document',
  title: 'Home Page',
  icon: File,
  groups: createGroups({
    types: [GroupType.SEO, GroupType.CONTENT],
    defaultGroup: GroupType.SEO,
  }),
  fields: [
    ...languageFields,
    ...seoFields({ withSlug: false }),
    ...pageBuilderFields({ group: GroupType.CONTENT }),
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
