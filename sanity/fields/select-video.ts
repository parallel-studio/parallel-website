import { defineField } from 'sanity'

export const selectVideoProjectField = ({
  defaultValue = 'video_short',
}: { defaultValue?: string } = {}) => {
  return defineField({
    name: 'video',
    title: 'Project Video',
    type: 'string',
    initialValue: defaultValue,
    validation: (Rule) => Rule.required(),
    options: {
      list: [
        { title: 'Video short', value: 'video_short' },
        { title: 'Video long', value: 'video_long' },
        { title: 'Video grid', value: 'video_grid' },
      ],
    },
  })
}
