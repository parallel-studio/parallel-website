import type { SchemaTypeDefinition } from 'sanity'

import { documentTypes } from './document'
import { layoutTypes } from './layout/'
import { pageTypes } from './pages'
import { SlicesTypes } from './slices'

export const schemaTypes = [
  ...layoutTypes,
  ...documentTypes,
  ...pageTypes,
  ...SlicesTypes,
] as SchemaTypeDefinition[]
