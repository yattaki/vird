import {
  ToVirdNode,
  VirdCommentNode,
  VirdFragmentNode,
  VirdNode,
  VirdTextNode
} from '../vird-node/vird-node'
import { VirdNodeTypes, virdNodeTypes } from '../vird-node/vird-node-types'
import { addVirdEvent } from '../vird/vird-event'
import { parseVirdProperties, VirdProperties } from '../vird/vird-properties'
import { cloneNode } from './clone-node'
import { createNodeFromNode } from './create-node-from-node'
import { createNodeFromString } from './create-node-from-string'

/**
 * This createNode() function creates a VirdNode.
 * @param base The base item for the created VirdNode.
 * @param properties An objects representing the VirdNode properties to create.
 */
export function createNode<
  T extends
    | VirdNodeTypes['text']
    | VirdNodeTypes['comment']
    | Text
    | Comment
    | VirdTextNode
    | VirdCommentNode
>(base: T, properties: ToVirdNode<T>['properties']): ToVirdNode<T>

/**
 * This createNode() function creates a VirdNode.
 * @param base The base item for the created VirdNode.
 * @param text The string assigned to the value of virdTextNode.properties.textContent.
 */
export function createNode<
  T extends
    | VirdNodeTypes['text']
    | VirdNodeTypes['comment']
    | Text
    | Comment
    | VirdTextNode
    | VirdCommentNode
>(base: T, text?: string): ToVirdNode<T>

/**
 * This createNode() function creates a VirdNode.
 * @param base The base item for the created VirdNode.
 * @param trim
 * A Boolean value that specifies the removal of elements that do not significantly affect the rendering.
 * If true, remove comments and text elements containing only spaces and line breaks.
 */
export function createNode<
  T extends VirdNodeTypes['fragment'] | DocumentFragment | VirdFragmentNode
>(base: T, trim: boolean): ToVirdNode<T>

/**
 * This createNode() function creates a VirdNode.
 * @param base The base item for the created VirdNode.
 * @param children An array or string that represents the children of the VirdNode.
 * @param trim
 * A Boolean value that specifies the removal of elements that do not significantly affect the rendering.
 * If true, remove comments and text elements containing only spaces and line breaks.
 */
export function createNode<
  T extends VirdNodeTypes['fragment'] | DocumentFragment | VirdFragmentNode
>(
  base: T,
  children: string | (string | VirdNode)[],
  trim?: boolean
): ToVirdNode<T>

/**
 * This createNode() function creates a VirdNode.
 * @param base The base item for the created VirdNode.
 * @param childrenOrTrim Argument that can choose one of these.
 * - children : An array or string that represents the children of the VirdNode.
 * - trim : A Boolean value that specifies the removal of elements that do not significantly affect the rendering.
 * If true, remove comments and text elements containing only spaces and line breaks.
 */
export function createNode<
  T extends VirdNodeTypes['fragment'] | DocumentFragment | VirdFragmentNode
>(
  base: T,
  childrenOrTrim?: string | (string | VirdNode)[] | boolean
): ToVirdNode<T>

/**
 * This createNode() function creates a VirdNode.
 * @param base The base item for the created VirdNode.
 * @param properties An objects representing the VirdNode properties to create.
 * @param children An array or string that represents the children of the VirdNode.
 * @param trim
 * A Boolean value that specifies the removal of elements that do not significantly affect the rendering.
 * If true, remove comments and text elements containing only spaces and line breaks.
 */
export function createNode<T extends string | Node | VirdNode>(
  base: T,
  properties: Partial<VirdProperties>,
  children: string | (string | VirdNode)[],
  trim?: boolean
): ToVirdNode<T>

/**
 * This createNode() function creates a VirdNode.
 * @param base The base item for the created VirdNode.
 * @param properties An objects representing the VirdNode properties to create.
 * @param trim
 * A Boolean value that specifies the removal of elements that do not significantly affect the rendering.
 * If true, remove comments and text elements containing only spaces and line breaks.
 */
export function createNode<T extends string | Node | VirdNode>(
  base: T,
  properties: Partial<VirdProperties>,
  trim: boolean
): ToVirdNode<T>

/**
 * This createNode() function creates a VirdNode.
 * @param base The base item for the created VirdNode.
 * @param children An array or string that represents the children of the VirdNode.
 * @param trim
 * A Boolean value that specifies the removal of elements that do not significantly affect the rendering.
 * If true, remove comments and text elements containing only spaces and line breaks.
 */
export function createNode<T extends string | Node | VirdNode>(
  base: T,
  children: string | (string | VirdNode)[],
  trim?: boolean
): ToVirdNode<T>

/**
 * This createNode() function creates a VirdNode.
 * @param base The base item for the created VirdNode.
 * @param trim
 * A Boolean value that specifies the removal of elements that do not significantly affect the rendering.
 * If true, remove comments and text elements containing only spaces and line breaks.
 */
export function createNode<T extends string | Node | VirdNode>(
  base: T,
  trim: boolean
): ToVirdNode<T>

/**
 * This createNode() function creates a VirdNode.
 * @param base The base item for the created VirdNode.
 * @param properties An objects representing the VirdNode properties to create.
 * @param childrenOrTrim Argument that can choose one of these.
 * - children : An array or string that represents the children of the VirdNode.
 * - trim : A Boolean value that specifies the removal of elements that do not significantly affect the rendering.
 * If true, remove comments and text elements containing only spaces and line breaks.
 */
export function createNode<T extends string | Node | VirdNode>(
  base: T,
  properties: Partial<VirdProperties>,
  childrenOrTrim?: string | (string | VirdNode)[] | boolean
): ToVirdNode<T>

/**
 * This createNode() function creates a VirdNode.
 * @param base The base item for the created VirdNode.
 * @param propertiesOrChildrenOrTrim Argument that can choose one of these.
 * - properties : An objects representing the VirdNode properties to create.
 * - children : An array or string that represents the children of the VirdNode.
 * - trim : A Boolean value that specifies the removal of elements that do not significantly affect the rendering.
 * If true, remove comments and text elements containing only spaces and line breaks.
 */
export function createNode<T extends string | Node | VirdNode>(
  base: T,
  propertiesOrChildrenOrTrim?:
    | Partial<VirdProperties>
    | string
    | (string | VirdNode)[]
    | boolean
): ToVirdNode<T>

/**
 * This createNode() function creates a VirdNode.
 * @param base The base item for the created VirdNode.
 * @param propertiesOrChildrenOrTrim Argument that can choose one of these.
 * - properties : An objects representing the VirdNode properties to create.
 * - children : An array or string that represents the children of the VirdNode.
 * - trim : A Boolean value that specifies the removal of elements that do not significantly affect the rendering.
 * If true, remove comments and text elements containing only spaces and line breaks.
 * @param childrenOrTrim Argument that can choose one of these.
 * - children : An array or string that represents the children of the VirdNode.
 * - trim : A Boolean value that specifies the removal of elements that do not significantly affect the rendering.
 * If true, remove comments and text elements containing only spaces and line breaks.
 * @param trim
 * A Boolean value that specifies the removal of elements that do not significantly affect the rendering.
 * If true, remove comments and text elements containing only spaces and line breaks.
 */
export function createNode<T extends string | Node | VirdNode>(
  base: T,
  propertiesOrChildrenOrTrim?:
    | Partial<VirdProperties>
    | string
    | (string | VirdNode)[]
    | boolean,
  childrenOrTrim?: string | (string | VirdNode)[] | boolean,
  trim?: boolean
): ToVirdNode<T>

export function createNode<T extends string | Node | VirdNode>(
  base: T,
  propertiesOrChildrenOrTrim?:
    | Partial<VirdProperties>
    | string
    | (string | VirdNode)[]
    | boolean,
  childrenOrTrim?: string | (string | VirdNode)[] | boolean,
  trim?: boolean
): ToVirdNode<T> {
  // create virdNode
  const virdNode =
    typeof base === 'string'
      ? createNodeFromString(base)
      : base instanceof Node
      ? createNodeFromNode(base, true)
      : cloneNode(base as VirdNode, { deep: true })

  // add properties
  if (
    typeof propertiesOrChildrenOrTrim === 'object' &&
    !Array.isArray(propertiesOrChildrenOrTrim)
  ) {
    const { events, properties } = parseVirdProperties(
      propertiesOrChildrenOrTrim
    )

    virdNode.properties = {
      ...virdNode.properties,
      ...properties
    }

    // add events
    for (const key of Object.keys(events)) {
      const value = events[key]
      if (typeof value === 'function') {
        addVirdEvent(virdNode, key, value)
      } else {
        addVirdEvent(virdNode, key, value.listener, value.options)
      }
    }
  } else if (propertiesOrChildrenOrTrim !== undefined) {
    childrenOrTrim = propertiesOrChildrenOrTrim
  }

  // add children
  if (typeof childrenOrTrim === 'string') {
    const lastTypes: string[] = [virdNodeTypes.text, virdNodeTypes.comment]
    if (lastTypes.includes(virdNode.type)) {
      virdNode.properties.textContent = childrenOrTrim
    } else {
      virdNode.children = [
        createNodeFromString('#text', { textContent: childrenOrTrim })
      ]
    }
  } else if (Array.isArray(childrenOrTrim)) {
    virdNode.children = childrenOrTrim.map(stringOrVirdNode => {
      return typeof stringOrVirdNode === 'string'
        ? createNodeFromString('#text', { textContent: stringOrVirdNode })
        : stringOrVirdNode
    })
  } else if (childrenOrTrim !== undefined) {
    trim = childrenOrTrim
  }

  // trimming
  if (trim) {
    virdNode.children = virdNode.children.filter(child => {
      if (child.type === virdNodeTypes.comment) return false
      if (child.type === virdNodeTypes.text) {
        if (child.properties.textContent === undefined) return false
        if (!/^\s*$/.test(child.properties.textContent)) return false
      }

      return true
    })
  }

  return virdNode as ToVirdNode<T>
}
