// /sanity/components/CharCountInput.tsx
'use client'

import { Stack, Text, TextInput } from '@sanity/ui'
import { set, unset } from 'sanity'
import { useMemo } from 'react'

interface CharCountInputProps {
  value?: string
  onChange: (event: any) => void
  schemaType: {
    options?: {
      maxLength?: number
    }
  }
}

const DEFAULT_MAX = 65

export function CharCountInput({
  value = '',
  onChange,
  schemaType,
}: CharCountInputProps) {
  const max = schemaType?.options?.maxLength ?? DEFAULT_MAX
  const count = value.length
  const remaining = max - count
  const percent = (remaining / max) * 100

  const tone = useMemo(() => {
    if (remaining < 0) return 'critical'
    if (percent <= 10) return 'caution'
    return 'default'
  }, [remaining, percent])

  const inputStyle =
    tone === 'critical'
      ? { backgroundColor: 'rgb(244, 203, 203)',
          borderRadius: '3px',
          border:'solid 1px rgb(220, 164, 164)'
        }
      : tone === 'caution'
      ? { backgroundColor: 'rgb(241, 200, 167)',
          borderRadius: '3px',
          border:'solid 1px rgb(208, 164, 132)'
       }
      : {}

  return (
    <Stack space={2}>
      <TextInput
        value={value}
        onChange={(e) =>
          onChange(e.currentTarget.value ? set(e.currentTarget.value) : unset())
        }
        style={inputStyle}
      />
      <Text size={1} tone={tone}>
        {remaining >= 0
          ? `${remaining} characters left`
          : `${Math.abs(remaining)} over limit`}
      </Text>
    </Stack>
  )
}
