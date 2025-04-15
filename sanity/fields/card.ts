import { defineField } from 'sanity'

import { GroupType } from '~/sanity/lib/groups'
export const cardFields = [
  defineField({
    name: 'cardThumbnail',
    type: 'image',
    title: 'Thumbnail',
    group: GroupType.CARD,
    validation: (Rule) => Rule.required(),
  }),
  defineField({
    name: 'cardIcon',
    type: 'image',
    title: 'Icon',
    group: GroupType.CARD,
    validation: (Rule) => Rule.required(),
  }),
  defineField({
    name: 'cardTitle',
    type: 'richText',
    title: 'Card Title',
    group: GroupType.CARD,
  }),
  defineField({
    name: 'cardExcerpt',
    type: 'richText',
    title: 'Excerpt',
    group: GroupType.CARD,
  }),
]
