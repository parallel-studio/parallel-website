export enum GroupType {
  SEO = 'seo',
  CONTENT = 'content',
  SETTINGS = 'settings',
  CARD = 'card',
  HEADER = 'header',
  PREHEADER = 'preheader',
  PROJECTSGRID = 'grid',
  VIDEOS = 'videos',
}

type Group = {
  name: string
  title: string
  default?: boolean
}

interface createGroupsProps {
  types: GroupType[]
  defaultGroup: GroupType
}

export const createGroups = ({ types, defaultGroup }: createGroupsProps) => {
  const groups: Group[] = types.map((type) => {
    const group: Group = {
      name: type,
      title: type.charAt(0).toUpperCase() + type.slice(1).toLowerCase(),
    }

    if (type === defaultGroup) {
      group.default = true
    }

    return group
  })

  return groups
}
