import { VirdNode } from './vird-node'

export function createText (text: string): VirdNode {
  const type = '#text'
  const properties = { textContent: text }
  const children: VirdNode[] = []

  return { type, properties, children }
}

export function createComment (comment: string): VirdNode {
  const type = '#comment'
  const properties = { textContent: comment }
  const children: VirdNode[] = []

  return { type, properties, children }
}

export function createFragment (...children: VirdNode[]): VirdNode {
  const type = '#document-fragment'
  const properties = {}

  return { type, properties, children }
}

export function createNode (type: string, children: string | (string | VirdNode)[]): VirdNode
export function createNode (type: string, properties: VirdNode['properties'], children?: string | (string | VirdNode)[]): VirdNode
export function createNode (type: string, properties?: VirdNode['properties'] | string | (string | VirdNode)[], children?: string | (string | VirdNode)[]): VirdNode
export function createNode (type: string, properties?: VirdNode['properties'] | string | (string | VirdNode)[], children?: string | (string | VirdNode)[]): VirdNode {
  if (!properties || typeof properties === 'string' || Array.isArray(properties)) {
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
