import {
  createVirdNode,
  VirdNode,
  VirdNodeTypes,
  virdNodeTypes,
  VirdNodeComment,
  VirdNodeText,
  VirdNodeFragment
} from '../../vird/index'

export function createNode (node: Node, trim?: boolean): VirdNode
export function createNode (type: VirdNodeTypes['text'], properties?: VirdNodeText['properties']): VirdNodeText
export function createNode (type: VirdNodeTypes['comment'], properties?: VirdNodeComment['properties']): VirdNodeComment
export function createNode (type: VirdNodeTypes['fragment'], children?: string | (string | VirdNode)[]): VirdNodeFragment
export function createNode (type: string, children: string | (string | VirdNode)[]): VirdNode
export function createNode (type: string, properties: VirdNode['properties'], children?: string | (string | VirdNode)[]): VirdNode
export function createNode (type: string, properties?: VirdNode['properties'] | string | (string | VirdNode)[], children?: string | (string | VirdNode)[]): VirdNode
export function createNode (
  nodeOrType: string | Node,
  propertiesOrTrim: VirdNode['properties'] | string | (string | VirdNode)[] | boolean = false,
  children?: string | (string | VirdNode)[]
): VirdNode {
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
    } else {
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
