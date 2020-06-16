import {
  createVirdNode,
  VirdNode,
  VirdNodeTypes,
  virdNodeTypes,
  VirdNodeComment,
  VirdNodeText,
  VirdNodeFragment,
  VirdElement
} from '../../vird/index'

export function createNode (node: Node, trim?: boolean): VirdNode
export function createNode (type: VirdNodeTypes['text'], properties?: VirdNodeText['properties']): VirdNodeText
export function createNode (type: VirdNodeTypes['comment'], properties?: VirdNodeComment['properties']): VirdNodeComment
export function createNode (type: VirdNodeTypes['fragment'], children?: string | (string | VirdNode)[]): VirdNodeFragment
export function createNode (type: string, children: string | (string | VirdNode)[]): VirdNode
export function createNode (type: string, properties: VirdNode['properties'], children?: string | (string | VirdNode)[]): VirdNode
export function createNode (type: string, properties?: VirdNode['properties'] | string | (string | VirdNode)[], children?: string | (string | VirdNode)[]): VirdNode
export function createNode (nodeOrType: string | Node, propertiesOrTrim?: VirdNode['properties'] | string | (string | VirdNode)[] | boolean, children?: string | (string | VirdNode)[]): VirdNode
export function createNode (nodeOrType: string | Node, propertiesOrTrim: VirdNode['properties'] | string | (string | VirdNode)[] | boolean = false, children?: string | (string | VirdNode)[]): VirdNode {
  if (typeof nodeOrType === 'string') {
    if (typeof propertiesOrTrim === 'boolean') { propertiesOrTrim = {} }
    return createVirdNode(nodeOrType, propertiesOrTrim, children)
  } else {
    const node = nodeOrType
    const type = node.nodeName.toLocaleLowerCase()
    const properties: VirdNode['properties'] = {}
    if (node instanceof Element) {
      for (const { name, value } of node.attributes) {
        properties[name] = value
      }
    } else if (!(node instanceof DocumentFragment)) {
      properties.textContent = node.textContent || ''
    }

    const trim = !!propertiesOrTrim
    let children = [...node.childNodes].map(node => createNode(node, trim))
    if (trim) {
      const filter = (virdNode: VirdNode) =>
        virdNode.type !== virdNodeTypes.comment &&
        (virdNode.type !== virdNodeTypes.text || !/^\s*$/.test(virdNode.properties.textContent))

      children = children.filter(filter)
    }

    return createVirdNode(type, properties, children)
  }
}

export function createElement (node: Node, trim?: boolean): VirdElement
export function createElement (type: string, children: string | (string | VirdNode | VirdElement)[]): VirdElement
export function createElement (type: string, properties: VirdNode['properties'], children?: string | (string | VirdNode | VirdElement)[]): VirdElement
export function createElement (type: string, properties?: VirdNode['properties'] | string | (string | VirdNode)[], children?: string | (string | VirdNode | VirdElement)[]): VirdElement
export function createElement (nodeOrType: string | Node, propertiesOrTrim?: VirdNode['properties'] | string | (string | VirdNode | VirdElement)[] | boolean, children?: string | (string | VirdNode | VirdElement)[]): VirdElement
export function createElement (nodeOrType: string | Node, propertiesOrTrim?: VirdNode['properties'] | string | (string | VirdNode | VirdElement)[] | boolean, children?: string | (string | VirdNode | VirdElement)[]): VirdElement {
  if (Array.isArray(propertiesOrTrim)) {
    children = propertiesOrTrim
    propertiesOrTrim = {}
  }

  const virdNode = createNode(
    nodeOrType,
    propertiesOrTrim,
    Array.isArray(children)
      ? children.map(child => child instanceof VirdElement ? child.virdNode : child)
      : children
  )

  return new VirdElement(virdNode)
}
