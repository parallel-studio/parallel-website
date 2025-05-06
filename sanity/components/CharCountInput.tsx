// /sanity/components/CharCountInput.tsx
import { useState } from 'react'
import { Stack, Text, TextInput } from '@sanity/ui'
import { set, unset } from 'sanity'

interface CharCountInputProps {
  value?: string
  onChange: (event: any) => void
  schemaType: { options?: { maxLength?: number } }
}

const DEFAULT_MAX = 65

export function CharCountInput({ value, onChange, schemaType }: CharCountInputProps) {
  const max = schemaType?.options?.maxLength || DEFAULT_MAX
  const count = value ? value.length : 0
  const remaining = max - count
  const percent = (remaining / max) * 100

  let counterColor = 'default'
  if (remaining < 0) counterColor = 'critical'
  else if (percent <= 10) counterColor = 'warning'

  const inputStyle =
    counterColor === 'critical' ? { borderColor: 'red' } :
    counterColor === 'warning' ? { borderColor: 'orange' } :
    {}

  return (
    <Stack space={2}>
      <TextInput
        value={value}
        onChange={(e) =>
          onChange(e.currentTarget.value ? set(e.currentTarget.value) : unset())
        }
        style={inputStyle}
      />
      <Text size={1} weight="medium" tone={counterColor}>
        {remaining >= 0 ? `${remaining} characters left` : `${remaining} over limit`}
      </Text>
    </Stack>
  )
}
