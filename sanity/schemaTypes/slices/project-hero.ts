import { defineField, defineType } from 'sanity'

export const projectHeroType = defineType({
  name: 'project-hero',
  type: 'object',
  title: 'Project Hero',
  initialValue: {
    layout: 'full-width',
  },
  fields: [
    defineField({
      name: 'layout',
      type: 'string',
      title: 'Layout',
      description: 'The layout of the full-screen-infinite-project-slider',
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: 'Full width', value: 'full-width' },
          { title: 'Two column', value: 'two-column' },
        ],
      },
    }),
    defineField({
      name: 'video',
      title: 'Video',
      type: 'string',
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: 'Video short', value: 'video_short' },
          { title: 'Video long', value: 'video_long' },
          { title: 'Video grid', value: 'video_grid' },
        ],
      },
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
      layout: 'layout',
      video: 'video',
    },
    prepare({ layout, video }) {
      const sliceType = 'Project Hero'
      return {
        title: `${sliceType}`,
        subtitle: `${layout || 'Untitled'} - ${video || 'Untitled'}`,
      }
    },
  },
})
