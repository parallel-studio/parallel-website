export const pageTypes = {
  PAGE: 'page',
  PAGE_PARALLEL: 'page-parallel',
  PAGE_PARACHUTES: 'page-parachutes',
  HOME_PAGE_PARALLEL: 'home-page-parallel',
  HOME_PAGE_PARACHUTES: 'home-page-parachutes',
}
export type pageTypesT = (typeof pageTypes)[keyof typeof pageTypes]

export const layoutTypes = {
  HEADER_PARACHUTES: 'header-parachutes',
  HEADER_PARALLEL: 'header-parallel',
}

export const combinedTypes = {
  ...pageTypes,
  ...layoutTypes,
} as const

export type documentTypes = (typeof combinedTypes)[keyof typeof combinedTypes]
