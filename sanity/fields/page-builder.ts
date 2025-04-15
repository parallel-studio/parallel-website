import { defineArrayMember, defineField } from 'sanity'

import type { GroupType } from '~/sanity/lib/groups'

export const pageBuilderFields = ({
  group,
}: { group: GroupType }): ReturnType<typeof defineField>[] => {
  return [
    defineField({
      name: 'pageBuilder',
      type: 'array',
      title: 'Page Builder',
      group: group,
      options: {
        layout: 'list',
      },
      of: [
        defineArrayMember({ type: 'full-width-video' }),
        defineArrayMember({ type: 'richText' }),
        defineArrayMember({ type: 'custom-column-image-grid' }),
        defineArrayMember({ type: 'custom-column-media-grid' }),
        defineArrayMember({ type: 'two-column-text-image' }),
        defineArrayMember({ type: 'full-screen-infinite-project-slider' }),
        defineArrayMember({ type: 'project-hero' }),
        defineArrayMember({ type: 'projects-grid' }),
        defineArrayMember({ type: 'about-section' }),
      ],
    }),
  ]
}
