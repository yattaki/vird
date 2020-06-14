export interface VirdNodeTypes {
  text: '#text'
  comment: '#comment'
  fragment: 'document-fragment'
}

export const virdNodeTypes: VirdNodeTypes = Object.defineProperties({}, {
  text: { value: '#text' },
  comment: { value: '#comment' },
  fragment: { value: '#document-fragment' }
})
