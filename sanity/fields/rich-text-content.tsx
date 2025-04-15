import { AlignCenter, Baseline, Code, PaintBucket, Rows } from 'lucide-react'
import { defineField } from 'sanity'

import type { GroupType } from '~/sanity/lib/groups'

const styleIconsSizes = { width: '1rem', height: '1rem' }

const TextAlignCenterDecorator = (props: any) => (
  <span style={{ textAlign: 'center' }}>{props.children}</span>
)
const TextAlignCenterIcon = () => (
  <span>
    <AlignCenter style={styleIconsSizes} />
  </span>
)

const ProjectColorDecorator = (props: any) => (
  <span
    style={{
      backgroundColor: 'var(--card-border-color)',
      mixBlendMode: 'multiply',
      padding: '.05rem',
      borderRadius: '0.25rem',
    }}
  >
    {props.children}
  </span>
)
const ProjectColorIcon = () => (
  <span>
    <PaintBucket style={styleIconsSizes} />
  </span>
)

const headingDecorator = (props: any, heading: string) => {
  switch (heading) {
    case 'h1':
      return <h1 style={{ margin: 0 }}>{props.children}</h1>
    case 'h2':
      return <h2 style={{ margin: 0 }}>{props.children}</h2>
    case 'h3':
      return <h3 style={{ margin: 0 }}>{props.children}</h3>
    case 'h4':
      return <h4 style={{ margin: 0 }}>{props.children}</h4>
    case 'h5':
      return <h5 style={{ margin: 0 }}>{props.children}</h5>
    case 'link-large':
      return (
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          {props.children}
        </div>
      )
    case 'link-small':
      return (
        <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>
          {props.children}
        </div>
      )
    default:
      return <p style={{ margin: 0 }}>{props.children}</p>
  }
}

const SubtitleDecorator = (props: any, subtitle: string) => (
  <span
    style={{
      paddingTop: '0.5rem',
      backgroundColor: 'rgba(243, 244, 246, 0.5)',
      padding: '.05rem',
      borderRadius: '0.25rem',
    }}
  >
    {props.children}
  </span>
)

const SubtitleIcon = () => (
  <span>
    <Baseline style={styleIconsSizes} />
  </span>
)

const RowIcon = () => (
  <span>
    <Rows style={styleIconsSizes} />
  </span>
)

const RowDecorator = (props: any, row: string) => (
  <span className={` ${row}`}>{props.children}</span>
)

const HtmlIcon = () => (
  <span>
    <Code style={styleIconsSizes} />
  </span>
)

export interface IRichTextContentField {
  name: string
  title: string
  group?: GroupType | string
}

export const richTextContentField = ({
  name,
  title,
  group,
}: IRichTextContentField) => {
  return defineField({
    name: name,
    title: title,
    type: 'array',
    group: group,
    of: [
      // @ts-expect-error
      {
        type: 'block',
        styles: [
          { title: 'Normal', value: 'normal' },
          {
            title: 'H1',
            value: 'h1',
            component: (props) => headingDecorator(props, 'h1'),
          },
          {
            title: 'H2',
            value: 'h2',
            component: (props) => headingDecorator(props, 'h2'),
          },
          {
            title: 'H3',
            value: 'h3',
            component: (props) => headingDecorator(props, 'h3'),
          },
          {
            title: 'H4',
            value: 'h4',
            component: (props) => headingDecorator(props, 'h4'),
          },
          {
            title: 'H5',
            value: 'h5',
            component: (props) => headingDecorator(props, 'h5'),
          },
          {
            title: 'Link large',
            value: 'link-large',
            component: (props) => headingDecorator(props, 'link-large'),
          },
          {
            title: 'Link small',
            value: 'link-small',
            component: (props) => headingDecorator(props, 'link-small'),
          },
        ],
        marks: {
          decorators: [
            { title: 'Strong', value: 'strong' },
            { title: 'Emphasis', value: 'em' },
            {
              title: 'row',
              value: 'row',
              icon: RowIcon,
              component: RowDecorator,
            },
            {
              title: 'subtitle',
              value: 'subtitle',
              icon: SubtitleIcon,
              component: SubtitleDecorator,
            },
            {
              title: 'Text Align Center',
              value: 'text-align-center',
              icon: TextAlignCenterIcon,
              component: TextAlignCenterDecorator,
            },
            {
              title: 'Project Color',
              value: 'project-color',
              icon: ProjectColorIcon,
              component: ProjectColorDecorator,
            },
          ],
        },
      },
      {
        type: 'code',
        title: 'Code Block',
        icon: HtmlIcon,
        options: {
          language: 'html',
          languageAlternatives: [
            { title: 'HTML', value: 'html' },
            { title: 'CSS', value: 'css' },
            { title: 'JavaScript', value: 'javascript' },
          ],
          withFilename: false,
        },
      },
    ],
  })
}
