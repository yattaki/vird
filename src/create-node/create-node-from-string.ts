import {
  VirdCommentNode,
  VirdFragmentNode,
  VirdNode,
  VirdTextNode
} from '../vird-node/vird-node'
import { virdNodeTypes } from '../vird-node/vird-node-types'

/**
 * This createNodeFromString() function creates a VirdNode from a string.
 * @param type A string that represents the type of VirdNode to create.
 * @param properties An object that represents the properties of the VirdNode to create.
 * @param children An array that represents the child nodes of the VirdNode to create.
 */
export function createNodeFromString(
  type: VirdTextNode['type'],
  properties?: VirdTextNode['properties'],
  children?: VirdTextNode['children']
): VirdTextNode
export function createNodeFromString(
  type: VirdCommentNode['type'],
  properties?: VirdCommentNode['properties'],
  children?: VirdCommentNode['children']
): VirdCommentNode
export function createNodeFromString(
  type: VirdFragmentNode['type'],
  properties?: VirdFragmentNode['properties'],
  children?: VirdFragmentNode['children']
): VirdFragmentNode
export function createNodeFromString(
  type: string,
  properties?: VirdNode['properties'],
  children?: VirdNode['children']
): VirdNode
export function createNodeFromString(
  type: string,
  properties: VirdNode['properties'] = {},
  children: VirdNode['children'] = []
) {
  type = type.toLocaleLowerCase()
  properties = { ...properties }
  children = [...children]

  if (
    !properties.textContent &&
    (virdNodeTypes.text === type || virdNodeTypes.comment === type)
  ) {
    properties.textContent = ''
  }

  return { type, properties, children } as VirdNode
}
