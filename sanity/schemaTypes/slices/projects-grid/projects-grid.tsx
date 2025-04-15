import { defineField, defineType } from 'sanity'

import { selectVideoProjectField } from '~/sanity/fields/select-video'

export const projectsGridType = defineType({
  name: 'projects-grid',
  type: 'object',
  title: 'Projects Grid',
  fields: [
    defineField({
      name: 'projects',
      type: 'array',
      title: 'Projects',
      of: [
        defineField({
          name: 'projectItem',
          type: 'object',
          title: 'Project Item',
          preview: {
            select: {
              details: 'project.details',
              color: 'project.color',
              sizeTitle: 'size.title',
              sizeValue: 'size.size',
            },
            prepare({ details, color, sizeTitle, sizeValue }) {
              return {
                title: `${details?.customer || ''} - ${details?.title || ''}`,
                subtitle: `${sizeTitle ?? ''} - ${sizeValue ?? ''}%`,
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
              name: 'autoPlay',
              type: 'boolean',
              title: 'Lecture automatique',
              description:
                'Lecture automatique de la vidéo au chargement (défaut: non)',
              initialValue: false,
            }),
            defineField({
              name: 'playOnHover',
              type: 'boolean',
              title: 'Lecture au survol',
              description:
                "Lecture de la vidéo au survol de l'élément (défaut: oui)",
              initialValue: true,
            }),
            defineField({
              name: 'lazyLoad',
              type: 'boolean',
              title: 'Chargement paresseux',
              description:
                'Optimiser le chargement en ne chargeant la vidéo que lorsque nécessaire (défaut: oui)',
              initialValue: true,
            }),
            defineField({
              name: 'preloadVideo',
              type: 'string',
              title: 'Préchargement vidéo',
              description: 'Stratégie de préchargement de la vidéo',
              initialValue: 'metadata',
              options: {
                list: [
                  { title: 'Aucun', value: 'none' },
                  { title: 'Métadonnées seulement', value: 'metadata' },
                  { title: 'Automatique', value: 'auto' },
                ],
              },
            }),
            defineField({
              name: 'size',
              title: 'Project Size',
              type: 'reference',
              to: [{ type: 'grid-size' }],
              validation: (Rule) => Rule.required().error('Size is required.'),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'gridOptimization',
      type: 'object',
      title: 'Optimisation de la grille',
      fields: [
        defineField({
          name: 'enableIntersectionObserver',
          type: 'boolean',
          title: 'Utiliser Intersection Observer',
          description:
            "Charge les vidéos uniquement lorsqu'elles sont visibles dans le viewport",
          initialValue: true,
        }),
        defineField({
          name: 'intersectionThreshold',
          type: 'number',
          title: "Seuil d'intersection",
          description:
            'Pourcentage de visibilité requis pour déclencher le chargement (0-1)',
          initialValue: 0.1,
          validation: (Rule) => Rule.min(0).max(1),
        }),
        defineField({
          name: 'preloadCount',
          type: 'number',
          title: 'Nombre de préchargements',
          description: 'Nombre de vidéos à précharger en avance',
          initialValue: 2,
          validation: (Rule) => Rule.min(0).max(10),
        }),
      ],
    }),
  ],
  preview: {
    select: {
      projects: 'projects',
    },
    prepare({ projects }) {
      let title = 'Projects Grid: '
      title += `${(projects || []).length} projects`
      return { title }
    },
  },
})
