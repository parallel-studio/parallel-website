interface Span {
  _type: 'span'
  text: string
  marks: string[]
}

interface Block {
  _type: 'block'
  children: Span[]
}

interface Selection {
  [key: string]: Block[] | { content: Block[] }
}

interface previewRichTextProps {
  title: string
  key: string
}

export const previewRichText = ({ title, key }: previewRichTextProps) => {
  return {
    select: {
      [key]: title,
    },
    prepare(selection: Selection) {
      const selectedBlocks = selection[key]
      const blockText = getBlockText(selectedBlocks)

      return {
        title: blockText || 'No title',
      }
    },
  }
}

export const getBlockText = (
  selectedBlocks: Block[] | { content: Block[] } | undefined
): string => {
  const blocks = Array.isArray(selectedBlocks)
    ? selectedBlocks
    : selectedBlocks?.content

  const block = (blocks || []).find((block: Block) => block._type === 'block')

  return block
    ? block.children
        .filter((child: Span) => child._type === 'span')
        .map((span: Span) => span.text)
        .join(' ')
    : ''
}
