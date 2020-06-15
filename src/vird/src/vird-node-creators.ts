import { VirdNode, VirdNodeText, VirdNodeComment, VirdNodeFragment } from './vird-node'
import { virdNodeTypes, VirdNodeTypes } from './vird-node-types'

export function cloneVirdNode<R extends VirdNode> (virdNode: R, deep = false): R {
  const type = virdNode.type
  const properties = { ...virdNode.properties }
  const children = deep ? virdNode.children.map(child => cloneVirdNode(child)) : []

  return { type, properties, children } as R
}

export function createVirdText (text = ''): VirdNodeText {
  const type = virdNodeTypes.text
  const properties = { textContent: text }
  const children: never[] = []

  return { type, properties, children }
}

export function createVirdComment (comment = ''): VirdNodeComment {
  const type = virdNodeTypes.comment
  const properties = { textContent: comment }
  const children: never[] = []

  return { type, properties, children }
}

export function createVirdFragment (...children: VirdNode[]): VirdNodeFragment {
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

  let addChildren: VirdNode[]
  if (typeof children === 'string') {
    addChildren = [createVirdText(children)]
  } else if (Array.isArray(children)) {
    addChildren = children.map(child => typeof child === 'string' ? createVirdText(child) : child)
  } else {
    addChildren = []
  }

  return { type, properties, children: addChildren }
}
