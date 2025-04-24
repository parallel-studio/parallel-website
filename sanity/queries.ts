import { groq } from 'next-sanity'

export const FIELDS_IMAGE = `
  "url": asset->url,
  "alt": asset->alt,
  asset->{
    altText,
    description,
  },
`

const FIELDS_LINK = groq`
  {
    title,
    isExternal,
    url,
    "slug": page->slug.current,
    targetBlank,
  }
`

const FIELDS_MEDIA = `
  "url": asset->url,
  "alt": asset->alt,
  asset->{
    altText,
    description,
  },
  video {
    asset-> { 
      playbackId,
      assetId,
      filename,
      aspect_ratio
    }
  },
  autoplay,
  muxPlaceholderTimestamp
`

export const FIELDS_GRID_SIZE = `
  _id,
  _type,
  title,
  size
`

export const FIELDS_ITEM = `
  _id,
  _type,
  title,
  tagLabel,
  tag,
  video {
    asset-> {
      playbackId,
      assetId,
      filename,
      aspect_ratio
    }
  },
  muxPlaceholderTimestamp
`

export const FIELDS_PROJECT = `
  _id,
  _type,
  details,
  slug,
  language,
  color,
  Videos {
    video_short {
      asset-> {
        playbackId,
        assetId,
        filename,
        data {
          aspect_ratio
        }
      }
    },
    video_long {
      asset-> {
        playbackId,
        assetId,
        filename,
        data {
          aspect_ratio
        }
      }
    },
    video_grid {
      asset-> {
        playbackId,
        assetId,
        filename,
        data {
          aspect_ratio
        }
      }
    },
  }
`

export const FIELDS_PROJECTS_ARRAY = `
  "projects": projects[] {
    ...,
    "size": size->{
      ${FIELDS_GRID_SIZE}
    },
    "project": project->{
      ${FIELDS_PROJECT}
    }
  }
`

export const FIELDS_PROJECTS_ARRAY_SLIDER = `
  "projects": projects[] {
    _type,
    "project": select(
      _type == "project" => {
        ...project->{
          ...,
          ${FIELDS_PROJECT}
        },
        "video": video,
        "muxPlaceholderTimestamp": muxPlaceholderTimestamp,
      }
    ),

    "item": select(
      _type == "item" => {
        ...,
        ${FIELDS_ITEM}
      }
    )
  }
`

export const PAGE_BUILDER_QUERY = `
{
  ...,
  _type == "full-screen-infinite-project-slider" => {
    ${FIELDS_PROJECTS_ARRAY_SLIDER}
  },

  _type == "projects-grid" => {
    ${FIELDS_PROJECTS_ARRAY}
  },
  
  _type == "custom-column-image-grid" => {
    ...,
    images[] {
      ...,
      ${FIELDS_IMAGE}
    }
  },

  _type == "custom-column-media-grid" => {
    ...,
    media[] {
      ...,
      ${FIELDS_MEDIA}
    },
    autoplayVideos
  },

  _type == "full-width-video" => {
    video {
      asset-> {
        playbackId,
        assetId,
        filename,
        data {
          aspect_ratio
        }
      }
    }
  },
  _type == "two-column-text-image" => {
    leftSlot {
      contentType,
      text,
      image {
        asset-> {
          url,
          alt
        }
      }
    },
    rightSlot {
      contentType,
      text,
      image {
        asset-> {
          url,
          alt
        }
      }
    }
  }
}
`

export const LOCALES_QUERY = groq`*[_type == "locale"]{id, title}`
export const LOCALES_QUERY_RESULT = groq`*[_type == "locale"]{id, title}`
export const PARALLEL_FOOTER_QUERY = groq`
  *[_type == "footer-parallel" && language == $language][0]{
    ...,
    links[] ${FIELDS_LINK},
  }
`
export const PARALLEL_HEADER_QUERY = groq`
  *[_type == "header-parallel" && language == $language][0]{
    ...,
    links[] ${FIELDS_LINK},
  }
`
export const PARALLEL_PROJECTS_QUERY = groq`
  *[_type == "project-parallel" && language == $language]
  | order(_createdAt desc) {
    ${FIELDS_PROJECT}
  }
`

export const PARALLEL_HOME_PAGE_QUERY = groq`
  *[_type == "home-page-parallel" && language == $language][0]{
    metaTitle,
    metaDescription,
    pageBuilder[] ${PAGE_BUILDER_QUERY}
  }
`
export const PARALLEL_PAGE_QUERY = groq`
  *[_type == "page-parallel" && language == $language && slug.current == $slug][0]{
    metaTitle,
    metaDescription,
    slug,
    pageBuilder[] ${PAGE_BUILDER_QUERY}
  }
`

export const PARALLEL_PROJECT_QUERY = groq`
  *[_type == "project-parallel" && language == $language && slug.current == $slug][0]{
    ${FIELDS_PROJECT},
    metaTitle,
    metaDescription,
    pageBuilder[] ${PAGE_BUILDER_QUERY}
  }
`
