import { createNodeFromNode } from '../../src/create-node/create-node-from-node'
import { VirdNode } from '../../src/vird-node/vird-node'
import { randomText } from '../utils/random'

describe('createNodeFromNode', () => {
  test('VirdNode is created correctly.', () => {
    const tag = randomText()
    const node = document.createElement(tag)

    const propertyKey = randomText()
    const propertyValue = randomText()
    node.setAttribute(propertyKey, propertyValue)

    const childTag = randomText()
    const childNode = document.createElement(childTag)
    node.appendChild(childNode)

    const virdNode: VirdNode = createNodeFromNode(node, true)
    expect(tag).toBe(node.nodeName.toLocaleLowerCase())
    expect(tag).toBe(virdNode.type)
    expect(node.getAttribute(propertyKey)).toEqual(
      virdNode.properties[propertyKey]
    )
    expect(node.childNodes.length).toBe(virdNode.children.length)
    expect(childTag).toEqual(virdNode.children[0].type)
  })
})
