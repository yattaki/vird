import { VirdNode } from '../../vird/index'

export function clearFragmentNode (virdNodes: VirdNode[], key = '#document-fragment') {
  const result: VirdNode[] = []

  const pushVirdNodes: VirdNode[] = []
  for (const virdNode of virdNodes) {
    if (virdNode.type === key) {
      const children = clearFragmentNode(virdNode.children)
      result.push(...children)
      pushVirdNodes.push(...children)
    } else {
      result.push(virdNode)
      pushVirdNodes.push(virdNode)
    }
  }

  return result
}
