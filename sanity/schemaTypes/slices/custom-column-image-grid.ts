import { defineField, defineType } from 'sanity'

export const customColumnImageGridType = defineType({
  name: 'custom-column-image-grid',
  type: 'object',
  title: 'Custom Column Image Grid',
  fields: [
    defineField({
      name: 'width',
      type: 'number',
      title: 'Width (en %)',
      description:
        'Largeur du conteneur sur desktop (entre 0 et 100). Si non renseigné, les images seront réparties équitablement.',
      validation: (Rule) => Rule.min(0).max(100),
    }),
    defineField({
      name: 'images',
      type: 'array',
      title: 'Images',
      of: [
        defineField({
          name: 'image',
          type: 'image',
          title: 'Image',
          options: {
            hotspot: true,
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({ title }) {
      const sliceType = 'Custom Column Image Grid'

      return {
        title: `${sliceType}`,
      }
    },
  },
})
