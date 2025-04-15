import { File } from 'lucide-react'
import { defineField, defineType } from 'sanity'

import { languageFields, pageBuilderFields, seoFields } from '~/sanity/fields'
import { GroupType, createGroups } from '~/sanity/lib/groups'

export const projectParachutesType = defineType({
  name: 'project-parachutes',
  type: 'document',
  title: 'Page',
  icon: File,
  groups: createGroups({
    types: [GroupType.SEO, GroupType.CONTENT, GroupType.SETTINGS],
    defaultGroup: GroupType.SEO,
  }),
  fields: [
    ...languageFields,
    ...seoFields({ withSlug: false }),
    ...pageBuilderFields({ group: GroupType.CONTENT }),
    defineField({
      name: 'color',
      title: 'Color',
      type: 'simplerColor',
      options: {
        colorFormat: 'hex',
      },
      group: GroupType.SETTINGS,
    }),
    defineField({
      name: 'expertise',
      type: 'string',
      group: GroupType.SETTINGS,
    }),
    defineField({
      name: 'customer',
      type: 'string',
      group: GroupType.SETTINGS,
    }),
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
