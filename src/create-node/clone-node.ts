import { VirdNode } from '../vird-node/vird-node'
import { cloneVirdEvent } from '../vird/vird-event'
import { createNodeFromString } from './create-node-from-string'

/**
 * The options object specifies the replication characteristics.
 */
export interface CloneNodeOptions {
  /**
   * A boolean that recursively duplicates child nodes.
   * If true, the node and its entire subtree are also copied.
   * Initial value is false.
   */
  deep: boolean
  /**
   * A boolean that recursively duplicates the events.
   * If true, apply the event registered in the node to the copy destination as well.
   * Initial value is false.
   */
  event: boolean
}

/**
 * This cloneNode() function duplicates VirdNode.
 * @param virdNode VirdNode to duplicate.
 * @param options
 */
export function cloneNode<R extends VirdNode>(
  virdNode: VirdNode,
  options: Partial<CloneNodeOptions> | boolean = {}
): R {
  if (typeof options === 'boolean') {
    options = { deep: options, event: options }
  }

  const { deep = false, event = false } = options

  const type = virdNode.type
  const properties = { ...virdNode.properties }
  const children = deep
    ? virdNode.children.map(child => cloneNode(child, options))
    : []

  const cloneVirdNode = createNodeFromString(type, properties, children)

  if (event) {
    cloneVirdEvent(cloneVirdNode, virdNode)
  }

  return cloneVirdNode as R
}
