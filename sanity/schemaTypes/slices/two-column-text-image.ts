import { defineField, defineType } from 'sanity'

export const twoColumnTextImageType = defineType({
  name: 'two-column-text-image',
  type: 'object',
  title: 'Text & Image',
  groups: [
    { name: 'left', title: 'Left', default: true },
    { name: 'right', title: 'Right' },
  ],
  fields: [
    defineField({
      name: 'leftSlot',
      type: 'object',
      title: 'Left',
      group: 'left',
      fields: [
        defineField({
          name: 'contentType',
          type: 'string',
          title: 'Content Type',
          options: {
            list: [
              { title: 'Text', value: 'text' },
              { title: 'Image', value: 'image' },
            ],
            layout: 'radio',
          },
        }),
        defineField({
          name: 'text',
          type: 'richText',
          title: 'Text Content',
          hidden: ({ parent }) => parent?.contentType !== 'text',
        }),
        defineField({
          name: 'image',
          type: 'image',
          title: 'Image Content',
          hidden: ({ parent }) => parent?.contentType !== 'image',
          options: {
            hotspot: true,
          },
        }),
      ],
    }),
    defineField({
      name: 'rightSlot',
      type: 'object',
      title: 'Right',
      group: 'right',
      fields: [
        defineField({
          name: 'contentType',
          type: 'string',
          title: 'Content Type',
          options: {
            list: [
              { title: 'Text', value: 'text' },
              { title: 'Image', value: 'image' },
            ],
            layout: 'radio',
          },
        }),
        defineField({
          name: 'text',
          type: 'richText',
          title: 'Text Content',
          hidden: ({ parent }) => parent?.contentType !== 'text',
        }),
        defineField({
          name: 'image',
          type: 'image',
          title: 'Image Content',
          hidden: ({ parent }) => parent?.contentType !== 'image',
          options: {
            hotspot: true,
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      leftSlotType: 'leftSlot.contentType',
      rightSlotType: 'rightSlot.contentType',
    },
    prepare({ leftSlotType, rightSlotType }) {
      return {
        title: `Left: ${leftSlotType || 'Empty'} | Right: ${rightSlotType || 'Empty'}`,
      }
    },
  },
})
