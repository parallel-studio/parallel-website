import { File } from 'lucide-react'
import { defineField, defineType } from 'sanity'

import { languageFields, pageBuilderFields, seoFields } from '~/sanity/fields'
import { GroupType, createGroups } from '~/sanity/lib/groups'

export const projectParallelType = defineType({
  name: 'project-parallel',
  type: 'document',
  title: 'Page',
  icon: File,
  groups: createGroups({
    types: [
      GroupType.CONTENT,
      GroupType.VIDEOS,
      GroupType.SETTINGS,
      GroupType.SEO,
    ],
    defaultGroup: GroupType.CONTENT,
  }),
  fields: [
    ...languageFields,
    defineField({
      name: 'color',
      title: 'Color',
      type: 'simplerColor',
      options: {
        colorFormat: 'hex',
      },
      group: GroupType.CONTENT,
    }),
    {
      type: 'object',
      name: 'details',
      group: GroupType.CONTENT,
      options: {
        collapsible: true,
        collapsed: false,
        modal: { type: 'popover' },
      },
      fieldsets: [
        {
          name: 'titleDescription',
          title: 'Titre & Description',
          options: {
            columns: 1, // Les champs de ce fieldset apparaîtront sur une seule colonne
          },
        },
        {
          name: 'expertiseCustomer',
          title: 'Expertise & Client',
          options: {
            columns: 2, // Les champs de ce fieldset apparaîtront sur deux colonnes
          },
        },
      ],
      fields: [
        defineField({
          name: 'title',
          type: 'string',
          fieldset: 'titleDescription',
        }),
        defineField({
          name: 'description',
          type: 'text',
          rows: 4,
          fieldset: 'titleDescription',
        }),
        defineField({
          name: 'expertise',
          type: 'string',
          fieldset: 'expertiseCustomer',
        }),
        defineField({
          name: 'customer',
          title: 'Client',
          type: 'string',
          fieldset: 'expertiseCustomer',
        }),
      ],
    },
    {
      type: 'object',
      name: 'Videos',
      group: GroupType.VIDEOS,
      options: {
        collapsible: true,
        collapsed: false,
        columns: 1,
        rows: 2,
        modal: { type: 'popover' },
      },
      fieldsets: [{ name: 'videos', title: 'Videos' }],
      fields: [
        defineField({
          name: 'video_short',
          title: 'Video Short',
          type: 'mux.video',
        }),
        defineField({
          name: 'video_long',
          title: 'Video Long',
          type: 'mux.video',
        }),
        defineField({
          name: 'video_grid',
          title: 'Video Grid',
          type: 'mux.video',
        }),
      ],
    },

    ...pageBuilderFields({ group: GroupType.CONTENT }),
    ...seoFields({ withSlug: true }),
  ],
  preview: {
    select: {
      details: 'details',
      color: 'color',
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
})
