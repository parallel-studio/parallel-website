import { defineField, defineType } from 'sanity'

import { GroupType, createGroups } from '~/sanity/lib/groups'

export const fullWidthVideoType = defineType({
  name: 'full-width-video',
  type: 'object',
  title: 'Full Width Video',
  groups: createGroups({
    types: [GroupType.CONTENT, GroupType.SETTINGS],
    defaultGroup: GroupType.CONTENT,
  }),
  fields: [
    defineField({
      name: 'video',
      type: 'mux.video',

      title: 'Video',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'muxPlaceholderTimestamp',
      type: 'string',
      title: 'Mux Placeholder Timestamp',
      description: 'The timestamp to use for the placeholder video',
    }),
  ],
  preview: {
    select: {
      video: 'video',
    },
    prepare({ video }) {
      const sliceType = 'Full Width Video'

      return {
        title: `${sliceType}`,
        subtitle: `${video.playbackId}`,
      }
    },
  },
})
