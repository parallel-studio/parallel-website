import { type FieldDefinition, defineField } from 'sanity'

import type { GroupType } from '~/sanity/lib/groups'
import { pageTypes, type pageTypesT } from '~/sanity/lib/schemaTypes'

export interface LinkFieldProps {
  types?: pageTypesT[]
  additionalFields?: linkAdditionalFields[]
  fieldTitle?: string
  fieldName?: string
  group?: GroupType | string
}

export enum linkAdditionalFields {
  TITLE = 'title',
  ICON = 'icon',
}

export const linkField = ({
  types = [...Object.values(pageTypes)],
  additionalFields = [],
  fieldTitle = 'Link',
  fieldName = 'link',
  group,
}: LinkFieldProps = {}) => {
  const fields: FieldDefinition[] = [
    defineField({
      name: 'isExternal',
      type: 'boolean',
      title: 'External Link',
      description: 'Check this box if the link is external',
      initialValue: false,
    }),
    defineField({
      name: 'targetBlank',
      type: 'boolean',
      title: 'Open in new tab',
      description: 'Check this box to open the link in a new tab',
      initialValue: false,
      hidden: ({ parent }) => {
        const isExternal = (parent as { isExternal?: boolean })?.isExternal
        return isExternal !== true
      },
    }),
    defineField({
      name: 'page',
      type: 'reference',
      to: types.map((type) => ({ type })),
      title: 'Page',
      hidden: ({ parent }) => {
        const isExternal = (parent as { isExternal?: boolean })?.isExternal
        return isExternal === true
      },
      validation: (Rule) =>
        Rule.custom((page, context) => {
          const parent = context.parent as { isExternal?: boolean }
          if (!parent?.isExternal && !page) {
            return 'Page reference is required for internal links'
          }
          return true
        }),
    }),
    defineField({
      name: 'url',
      type: 'url',
      title: 'External URL',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['http', 'https', 'mailto', 'tel'],
        }),
      hidden: ({ parent }) => {
        const isExternal = (parent as { isExternal?: boolean })?.isExternal
        return isExternal === false
      },
    }),
  ]

  if (additionalFields.includes(linkAdditionalFields.TITLE)) {
    fields.push(
      defineField({
        name: 'title',
        type: 'string',
        title: 'Title',
        validation: (Rule) =>
          Rule.custom((title, context) => {
            const icon = (context.parent as { icon?: any })?.icon
            if (icon && title) {
              return 'You cannot fill both the title and the icon fields'
            }
            return true
          }),
      })
    )
  }

  if (additionalFields.includes(linkAdditionalFields.ICON)) {
    fields.push(
      defineField({
        name: 'icon',
        type: 'image',
        title: 'Icon',
        options: {
          hotspot: true,
        },
        hidden: ({ parent }) => {
          const title = (parent as { title?: string })?.title
          return !!title
        },
        validation: (Rule) =>
          Rule.custom((icon, context) => {
            const title = (context.parent as { title?: string })?.title
            if (icon && title) {
              return 'You cannot fill both the title and the icon fields'
            }
            return true
          }),
      })
    )
  }

  return defineField({
    name: fieldName,
    type: 'object',
    title: fieldTitle,
    group,
    fields,
    preview: {
      select: {
        title: 'title',
        isExternal: 'isExternal',
        url: 'url',
        icon: 'icon',
      },
      prepare(selection) {
        const { title, isExternal, url, icon } = selection
        const displayUrl = isExternal ? url : 'Internal link'
        const displayTitle = icon ? 'Icon' : title

        return {
          title: `${displayTitle} (${isExternal ? 'External' : 'Internal'})`,
          subtitle: displayUrl,
        }
      },
    },
  })
}
