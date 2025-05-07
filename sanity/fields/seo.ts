import { type SlugValidationContext, defineField } from 'sanity'

import { GroupType } from '~/sanity/lib/groups'

import { CharCountInput } from '~/sanity/components/CharCountInput'

type SeoFieldTypes = ReturnType<typeof defineField>

interface SeoFieldsOptions {
  withSlug: boolean
}

export const seoFields = ({
  withSlug = false,
}: SeoFieldsOptions): SeoFieldTypes[] => {
  const fields: SeoFieldTypes[] = [
    defineField({
      name: 'metaTitle',
      type: 'string',
      group: GroupType.SEO,
      title: 'Meta Title (55-60 char)',
      components: {
        input: CharCountInput,
      },
      options: {
        maxLength: 65, // nécessaire pour que le compteur sache quoi afficher
      },
    }),
    defineField({
      name: 'metaDescription',
      type: 'text',
      group: GroupType.SEO,
      title: 'Meta Description (160 char)',
      components: {
        input: CharCountInput,
      },
      options: {
        maxLength: 160, // nécessaire pour que le compteur sache quoi afficher
      },
    }),
  ]

  if (withSlug) {
    fields.push(
      defineField({
        name: 'slug',
        type: 'slug',
        title: 'Slug',
        group: GroupType.SEO,
        options: {
          isUnique: isUniqueOtherThanLanguage,
        },
        validation: (rule) => rule.required(),
      })
    )
  }

  return fields
}

export async function isUniqueOtherThanLanguage(
  slug: string,
  context: SlugValidationContext
) {
  const { document, getClient } = context
  if (!document?.language) {
    return true
  }
  const client = getClient({ apiVersion: '2023-04-24' })
  const id = document._id.replace(/^drafts\./, '')
  const params = {
    draft: `drafts.${id}`,
    published: id,
    language: document.language,
    slug,
  }
  const query = `!defined(*[
    !(_id in [$draft, $published]) &&
    slug.current == $slug &&
    language == $language
  ][0]._id)`
  const result = await client.fetch(query, params)
  return result
}
