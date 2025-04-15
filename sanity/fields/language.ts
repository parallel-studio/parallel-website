import { defineField } from 'sanity'

export const languageFields = [
  defineField({
    name: 'language',
    type: 'string',
    readOnly: true,
    hidden: true,
  }),
  defineField({
    name: 'languageTitle',
    type: 'string',
    readOnly: true,
    hidden: true,
  }),
]
