import { defineField, defineType } from 'sanity'

import { selectVideoProjectField } from '~/sanity/fields/select-video'

export const projectGridRowType = defineType({
  name: 'project-grid-row-type',
  type: 'object',
  title: 'Row',
  fields: [
    defineField({
      name: 'projectItem',
      type: 'object',
      title: 'Project Item',
      preview: {
        select: {
          details: 'project.details',
          color: 'project.color',
        },
        prepare({ details, color }) {
          return {
            title: `${details?.customer || ''} - ${details?.title || ''}`,
            subtitle: details.expertise,
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
      fields: [
        defineField({
          name: 'project',
          type: 'reference',
          to: [{ type: 'project-parallel' }],
          title: 'Project Reference',
        }),
        selectVideoProjectField(),
        defineField({
          name: 'muxPlaceholderTimestamp',
          type: 'string',
          title: 'Mux Placeholder Timestamp',
          description: 'The timestamp to use for the placeholder video',
        }),
        defineField({
          name: 'size',
          type: 'string',
          title: 'Project Size',
          options: {
            list: [
              { title: 'Wide (50%)', value: 'wide' },
              { title: 'Medium (37.5%)', value: 'medium' },
              { title: 'Narrow (25%)', value: 'narrow' },
            ],
            layout: 'radio',
          },
          validation: (Rule) => Rule.required().error('Size is required.'),
        }),
      ],
    }),
  ],
  preview: {
    select: {
      projects: 'projectsInThisRow',
    },
    prepare({ projects }) {
      if (!projects || !projects.length) {
        return { title: 'Row: 0 items' }
      }
      const count = projects.length
      const sizes = projects.map((p: any) => p.size || '?').join(', ')
      return {
        title: `Row: ${count} item${count > 1 ? 's' : ''} [${sizes}]`,
      }
    },
  },
})
