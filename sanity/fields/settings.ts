import { defineField } from 'sanity'

import { ColorInput } from '~/sanity/input/custom'
import { colorOptions } from '~/sanity/lib/colors'
import type { GroupType } from '~/sanity/lib/groups'

export interface settingsFieldsProps {
  name: string
  title: string
  group: GroupType
}

export const backgroundColorSettingsFields = ({
  group,
  name,
  title,
}: settingsFieldsProps): ReturnType<typeof defineField> => {
  const options = colorOptions.map((option) => ({
    title: option.title,
    value: `bg-${option.value}`,
    color: option.color,
  }))

  return defineField({
    name: name,
    type: 'string',
    title: title,
    group: group,
    components: {
      input: ColorInput,
    },
    options: {
      list: options,
      layout: 'radio',
    },
  })
}

export const visibilitySettingsFields = ({
  group,
  name,
  title,
}: settingsFieldsProps): ReturnType<typeof defineField> => {
  return defineField({
    name: name,
    title: title,
    type: 'object',
    group: group,
    fields: [
      {
        name: 'visibleOnMobile',
        title: 'Visible on Mobile',
        type: 'boolean',
        initialValue: true,
      },
      {
        name: 'visibleOnDesktop',
        title: 'Visible on Desktop',
        type: 'boolean',
        initialValue: true,
      },
    ],
    validation: (Rule) => Rule.required(),
  })
}
