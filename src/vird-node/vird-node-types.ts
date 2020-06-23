/** A type list with a special meaning in the VirdNode element. */
export interface VirdNodeTypes {
  /** An string representing the VirdNodeText. */
  readonly text: '#text'
  /** An object representing the VirdNodeComment. */
  readonly comment: '#comment'
  /** An object representing the VirdNodeFragment. */
  readonly fragment: '#document-fragment'
}

export const virdNodeTypes: VirdNodeTypes = {
  text: '#text',
  comment: '#comment',
  fragment: '#document-fragment'
}
