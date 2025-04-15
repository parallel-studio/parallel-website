import React from 'react'
import { defineField, defineType } from 'sanity'

export const customColumnMediaGridType = defineType({
  name: 'custom-column-media-grid',
  type: 'object',
  title: 'Custom Column Media Grid',
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
      name: 'media',
      type: 'array',
      title: 'Médias',
      description: 'Ajoutez des images ou des vidéos',
      initialValue: [],
      of: [
        {
          type: 'image',
          title: 'Image',
          options: {
            hotspot: true,
          },
        },
        {
          type: 'object',
          title: 'Vidéo',
          fields: [
            {
              name: 'video',
              type: 'mux.video',
              title: 'Vidéo',
            },
            {
              name: 'autoplay',
              type: 'boolean',
              title: 'Lecture automatique',
              description: 'Activer la lecture automatique de la vidéo',
              initialValue: false,
            },
          ],
          preview: {
            select: {
              playbackId: 'video.asset.playbackId',
              autoplay: 'autoplay',
            },
            prepare({ playbackId, autoplay }) {
              const thumbnailUrl = playbackId
                ? `https://image.mux.com/${playbackId}/thumbnail.jpg?width=100&height=100&fit_mode=crop`
                : undefined

              return {
                title: 'Vidéo',
                subtitle: autoplay
                  ? 'Lecture automatique activée'
                  : 'Lecture automatique désactivée',
                media: thumbnailUrl
                  ? React.createElement('img', {
                      src: thumbnailUrl,
                      alt: 'Miniature Vidéo',
                      style: {
                        objectFit: 'contain',
                        width: '100%',
                        height: '100%',
                      },
                    })
                  : undefined,
              }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      media: 'media',
    },
    prepare({ media }) {
      const sliceType = 'Custom Column Media Grid'
      const mediaCount = media?.length || 0

      return {
        title: `${sliceType} (${mediaCount} médias)`,
      }
    },
  },
})
