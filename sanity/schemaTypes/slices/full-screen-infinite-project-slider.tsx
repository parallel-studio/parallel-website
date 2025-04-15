import { defineField, defineType } from 'sanity'
import { richTextContentField } from '~/sanity/fields'
import { selectVideoProjectField } from '~/sanity/fields/select-video'

export const fullScreenInfiniteProjectSlider = defineType({
  name: 'full-screen-infinite-project-slider',
  type: 'object',
  title: 'Full Screen Infinite Project Slider',
  initialValue: {
    settings: {
      sliderSpeed: 1,
      // wheelSpeed: 0.25,
    },
  },
  fields: [
    richTextContentField({
      name: 'title',
      title: 'Title',
    }),
    defineField({
      name: 'settings',
      type: 'object',
      title: 'Slider Settings',
      fields: [
        defineField({
          name: 'sliderSpeed',
          type: 'number',
          title: 'Slider Speed',
          description: 'The speed of the slider',
          validation: (Rule) => Rule.min(0.1).max(10),
          initialValue: 1,
        }),
      ],
    }),
    defineField({
      name: 'projects',
      type: 'array',
      title: 'Selected Projects',
      of: [
        defineField({
          name: 'project',
          type: 'object',
          title: 'Project',
          fields: [
            defineField({
              name: 'project',
              type: 'reference',
              to: [{ type: 'project-parallel' }],
              title: 'Project',
              options: {
                filter: ({ document }) => {
                  const lang = document?.language
                  return {
                    filter: 'language == $lang',
                    params: { lang },
                  }
                },
              },
            }),
            selectVideoProjectField(),
            defineField({
              name: 'muxPlaceholderTimestamp',
              type: 'string',
              title: 'Mux Placeholder Timestamp',
              description: 'The timestamp to use for the placeholder video',
            }),
          ],
          preview: {
            select: {
              details: 'project.details',
              color: 'project.color',
            },
            prepare({ details, color }) {
              return {
                title: `${details?.customer || 'Untitled'} - ${details?.title || 'Untitled'}`,
                subtitle: details?.expertise,
                color: color,
                media: (
                  <span
                    style={{
                      backgroundColor: color?.value ?? '',
                      width: '100%',
                      height: '100%',
                    }}
                  />
                ),
              }
            },
          },
        }),
        defineField({
          name: 'item',
          type: 'object',
          title: 'Item',
          fields: [
            defineField({
              name: 'title',
              type: 'string',
            }),
            defineField({
              name: 'tagLabel',
              type: 'string',
            }),
            defineField({
              name: 'tag',
              type: 'string',
            }),
            defineField({
              name: 'video',
              title: 'Video',
              type: 'mux.video',
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
              title: 'title',
              tagLabel: 'tagLabel',
              tag: 'tag',
            },
            prepare({ title, tagLabel, tag }) {
              return {
                title: `${title || 'Untitled'} - ${tagLabel || 'Untitled'} - ${tag || 'Untitled'}`,
                subtitle: tag,
              }
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: `Full Screen Infinite Project Slider`,
      }
    },
  },
})
