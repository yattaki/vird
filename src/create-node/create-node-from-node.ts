import {
  VirdCommentNode,
  VirdFragmentNode,
  VirdNode,
  VirdTextNode
} from '../vird-node/vird-node'
import { createNodeFromString } from './create-node-from-string'

/**
 * This createNodeFromNode() function creates a VirdNode from a Node.
 * @param node
 * A Node is used when creating a VirdNode.
 * The type of VirdNode created is the nodeName property converted to lowercase.
 */
export function createNodeFromNode(node: Text): VirdTextNode
export function createNodeFromNode(node: Comment): VirdCommentNode

/**
 * This createNodeFromNode() function creates a VirdNode from a Node.
 * @param node
 * A Node is used when creating a VirdNode.
 * The type of VirdNode created is the nodeName property converted to lowercase.
 * @param deep
 * A boolean that recursively duplicates child nodes.
 * If true, the node and its entire subtree are also transformed.
 * Initial value is false.
 */
export function createNodeFromNode(
  node: DocumentFragment,
  deep: boolean
): VirdFragmentNode
export function createNodeFromNode(node: Node, deep?: boolean): VirdNode
export function createNodeFromNode(node: Node, deep = false): VirdNode {
  const type = node.nodeName
  const properties: VirdNode['properties'] = {}

  if (node instanceof Element) {
    for (const { name, value } of node.attributes) {
      properties[name] = value
    }

    if ('value' in node) {
      properties.value = (node as HTMLInputElement).value
    }
  } else if (node instanceof Comment || node instanceof Text) {
    properties.textContent = node.textContent || ''
  }

  const mapCallback = (child: Node) => createNodeFromNode(child, deep)
  const children: VirdNode[] = deep ? [...node.childNodes].map(mapCallback) : []

  return createNodeFromString(type, properties, children)
}
