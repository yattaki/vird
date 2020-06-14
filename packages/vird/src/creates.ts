import { VirdNode, VirdNodeText, VirdNodeComment, VirdNodeFragment } from './vird-node'
import { virdNodeTypes, VirdNodeTypes } from './vird-node-types'

export function createText (text: string): VirdNodeText {
  const type = virdNodeTypes.text
  const properties = { textContent: text }
  const children: never[] = []

  return { type, properties, children }
}

export function createComment (comment: string): VirdNodeComment {
  const type = virdNodeTypes.comment
  const properties = { textContent: comment }
  const children: never[] = []

  return { type, properties, children }
}

export function createFragment (...children: VirdNode[]): VirdNodeFragment {
  const type = virdNodeTypes.fragment
  const properties = {}

  return { type, properties, children }
}

export function createVirdNode (type: VirdNodeTypes['text'], properties?: VirdNodeText['properties']): VirdNodeText
export function createVirdNode (type: VirdNodeTypes['comment'], properties?: VirdNodeComment['properties']): VirdNodeComment
export function createVirdNode (type: VirdNodeTypes['fragment'], children?: string | (string | VirdNode)[]): VirdNodeFragment
export function createVirdNode (type: string, children: string | (string | VirdNode)[]): VirdNode
export function createVirdNode (type: string, properties: VirdNode['properties'], children?: string | (string | VirdNode)[]): VirdNode
export function createVirdNode (type: string, properties?: VirdNode['properties'] | string | (string | VirdNode)[], children?: string | (string | VirdNode)[]): VirdNode
export function createVirdNode (type: string, properties?: VirdNode['properties'] | string | (string | VirdNode)[], children?: string | (string | VirdNode)[]): VirdNode {
  if (typeof properties !== 'object' || Array.isArray(properties)) {
    children = properties
    properties = {}
  }

  if (typeof children === 'string') {
    children = [children]
  } else if (!Array.isArray(children)) {
    children = []
  }

  const createChildren = children.map(child => typeof child === 'string' ? createText(child) : child)

  return { type, properties, children: createChildren }
}
