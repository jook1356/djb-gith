import { NodeViewContent, NodeViewWrapper, ReactNodeViewProps } from '@tiptap/react'
import React from 'react'
import './CodeBlockComponent.scss'

export default ({
  node: {
    attrs: { language: defaultLanguage },
  },
  updateAttributes,
  extension,
}: ReactNodeViewProps) => (
  <NodeViewWrapper className="codeBlock">
    <select
      contentEditable={false}
      defaultValue={defaultLanguage}
      onChange={(event) => updateAttributes({ language: event.target.value })}
    >
      <option value="null">auto</option>
      <option disabled>—</option>
      {extension.options.lowlight.listLanguages().map((lang: string, index: number) => (
        <option key={index} value={lang}>
          {lang}
        </option>
      ))}
    </select>
    <pre>
      <NodeViewContent as="div" />
    </pre>
  </NodeViewWrapper>
)
