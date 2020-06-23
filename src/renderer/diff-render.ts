import { createNode } from '../create-node/create-node'
import { VirdNode } from '../vird-node/vird-node'
import { getVirdEventMap } from '../vird/vird-event'
import { createRealNode } from './create-real-node'
import { diff } from './diff'

const beforeVirdNodes: WeakMap<Node, VirdNode[]> = new WeakMap()
const nodeMap: WeakMap<VirdNode, Node> = new WeakMap()
export function diffRender(rootNode: Node, newVirdNodes: VirdNode[]) {
  const oldVirdNodes =
    beforeVirdNodes.get(rootNode) ||
    [...rootNode.childNodes].map(child => createNode(child))

  beforeVirdNodes.set(rootNode, newVirdNodes)

  let index = 0
  let newVirdNodeIndex = 0
  let oldVirdNodeIndex = 0
  const newVirdNodeLength = newVirdNodes.length
  const oldVirdNodeLength = oldVirdNodes.length
  const maxIndex = Math.max(newVirdNodeLength, oldVirdNodeLength)

  while (index < maxIndex) {
    const newVirdNode = newVirdNodes[newVirdNodeIndex] as VirdNode | undefined
    const oldVirdNode = oldVirdNodes[oldVirdNodeIndex] as VirdNode | undefined
    const oldNode = oldVirdNode && nodeMap.get(oldVirdNode)

    if (newVirdNode) {
      let nextNode = oldNode
      if (!oldVirdNode || oldVirdNode.type !== newVirdNode.type) {
        const realNode = createRealNode(newVirdNode)
        nextNode = realNode

        if (oldNode) {
          beforeVirdNodes.delete(oldNode)

          if (newVirdNodeLength > oldVirdNodeLength) {
            rootNode.insertBefore(realNode, oldNode)
            oldVirdNodeIndex--
          } else if (newVirdNodeLength < oldVirdNodeLength) {
            rootNode.removeChild(oldNode)
            newVirdNodeIndex--
          } else {
            rootNode.replaceChild(realNode, oldNode)
          }
        } else {
          rootNode.appendChild(realNode)
        }
      }

      if (nextNode) {
        nodeMap.set(newVirdNode, nextNode)

        const diffProperties = diff(
          newVirdNode.properties,
          oldVirdNode && oldVirdNode.properties
        )

        if (nextNode instanceof Element) {
          for (const name of Object.keys(diffProperties)) {
            const newValue = diffProperties[name]
            const value = newValue && newValue[0]

            if (value) {
              nextNode.setAttribute(name, value)
            } else {
              nextNode.removeAttribute(name)
            }
          }

          if (oldVirdNode) {
            const oldEventMap = getVirdEventMap(oldVirdNode)
            for (const name of Object.keys(oldEventMap)) {
              const eventMap = oldEventMap[name]
              for (const { listener } of eventMap) {
                nextNode.removeEventListener(name, listener)
              }
            }
          }

          const oldEventMap = getVirdEventMap(newVirdNode)
          for (const name of Object.keys(oldEventMap)) {
            const eventMap = oldEventMap[name]
            for (const { listener, options } of eventMap) {
              nextNode.addEventListener(name, listener, options)
            }
          }
        } else {
          if (diffProperties.textContent) {
            nextNode.textContent = diffProperties.textContent[0] || ''
          }
        }

        diffRender(nextNode, newVirdNode.children)
      }
    } else if (oldNode) {
      const parent = oldNode.parentElement
      if (parent) {
        parent.removeChild(oldNode)
      }
    }

    index++
    newVirdNodeIndex++
    oldVirdNodeIndex++
  }
}
