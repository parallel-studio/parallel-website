import type React from 'react'
import {
  PatchEvent,
  type StringInputProps,
  type StringSchemaType,
  type TitledListValue,
  set,
  unset,
} from 'sanity'

import { Card, Inline, Radio, Stack, Text } from '@sanity/ui'

interface ColorOption extends TitledListValue<string> {
  color?: string
}

type ColorInputProps = StringInputProps<StringSchemaType>

export const ColorInput: React.FC<ColorInputProps> = (props) => {
  const { onChange, value, schemaType } = props

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.currentTarget.value
    onChange(PatchEvent.from(newValue ? set(newValue) : unset()))
  }

  return (
    <Stack space={3}>
      {schemaType.options?.list?.map((option) => {
        const optionValue = typeof option === 'string' ? option : option.value
        const optionTitle = typeof option === 'string' ? option : option.title
        const optionColor =
          typeof option === 'string' ? 'inherit' : (option as ColorOption).color

        const isSelected = value === optionValue

        return (
          <Card key={optionValue} as="label" padding={2} radius={2}>
            <Inline space={2}>
              <Radio
                checked={isSelected}
                name={schemaType.name}
                onChange={handleChange}
                value={optionValue}
              />
              <Text style={{ color: optionColor }}>{optionTitle}</Text>
            </Inline>
          </Card>
        )
      })}
    </Stack>
  )
}
