'use client'

import { codeInput } from '@sanity/code-input'
import { visionTool } from '@sanity/vision'
import { type ConfigContext, defineConfig } from 'sanity'
import { internationalizedArray } from 'sanity-plugin-internationalized-array'
import { simplerColorInput } from 'sanity-plugin-simpler-color-input'
import { structureTool } from 'sanity/structure'

import { documentInternationalization } from '@sanity/document-internationalization'
import { media } from 'sanity-plugin-media'
import { muxInput } from 'sanity-plugin-mux-input'
import { dataset, projectId } from '~/sanity/env'
import { RemoveAllFieldsGroup } from '~/sanity/lib/utils'
import { LOCALES_QUERY } from '~/sanity/queries'
import { schemaTypes } from '~/sanity/schemaTypes'
import { defaultDocumentNode, structure } from '~/sanity/structure/structure'

export default defineConfig({
  name: 'default',
  title: 'Parallel Studio',
  basePath: '/studio',
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure,
      defaultDocumentNode,
    }),
    media(),
    muxInput(),
    simplerColorInput({
      defaultColorFormat: 'rgba',
    }),
    visionTool(),
    documentInternationalization({
      supportedLanguages: (client) => client.fetch(LOCALES_QUERY),
      languageField: 'language',
      schemaTypes: [
        'home-page-parachutes',
        'home-page-parallel',
        'project-parachutes',
        'project-parallel',
        'page-parachutes',
        'page-parallel',
        'footer-parachutes',
        'footer-parallel',
        'header-parachutes',
        'header-parallel',
      ],
    }),
    internationalizedArray({
      languages: async (client) => await client.fetch(LOCALES_QUERY),
      fieldTypes: ['string', 'text'],
    }),
    codeInput(),
  ],
  schema: {
    types: schemaTypes,
    templates: (prev, configContext: ConfigContext) => {
      return [...prev]
    },
  },
  form: {
    components: {
      input: RemoveAllFieldsGroup,
    },
  },
  tools: (prev, { currentUser }) => {
    const isAdmin = currentUser?.roles.some(
      (role) => role.name === 'administrator'
    )

    if (isAdmin) {
      return prev
    }

    return prev.filter((tool) => tool.name !== 'vision')
  },
})
