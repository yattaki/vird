import { cloneNode } from '../create-node/clone-node'
import { VirdNode } from '../vird-node/vird-node'
import { virdNodeTypes } from '../vird-node/vird-node-types'
import { diffRender } from './diff-render'
import { reserves } from './reserve'

function filterIgnoreVirdNode(virdNodes: VirdNode[]) {
  const result: VirdNode[] = []

  for (const virdNode of virdNodes) {
    if (virdNode.type === virdNodeTypes.fragment) {
      const children = filterIgnoreVirdNode(virdNode.children)
      result.push(...children)
    } else {
      result.push(virdNode)
    }
  }

  return result
}

/**
 * The render() function renders a VirdNode into a Dom.
 * @param rootNode A node to render.
 * @param virdNodes An array of VirdNode objects to render.
 */
export function render(rootNode: Node, ...virdNodes: VirdNode[]) {
  for (const reserve of reserves) {
    cancelAnimationFrame(reserve)
  }
  reserves.length = 0

  const newVirdNodeLength = virdNodes.length
  if (newVirdNodeLength < 1) return

  // Create a VirdNode for rendering.
  const clone = (virdNode: VirdNode) => cloneNode(virdNode, true)
  const cloneVirdNodes = virdNodes.map(clone)
  const newVirdNodes = filterIgnoreVirdNode(cloneVirdNodes)

  // rendering.
  diffRender(rootNode, newVirdNodes)
}
