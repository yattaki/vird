import { VirdNode } from '../../src/vird-node/vird-node'
import { createNodeFromString } from '../../src/create-node/create-node-from-string'
import { randomText } from '../utils/random'

describe('createNodeFromString', () => {
  test('VirdNode is created correctly.', () => {
    const type = randomText()
    const properties = { [randomText()]: randomText() }
    const children = [createNodeFromString(randomText())]

    const virdNode: VirdNode = createNodeFromString(type, properties, children)
    expect(virdNode.type).toBe(type)
    expect(virdNode.properties).toEqual(properties)
    expect(virdNode.children).toEqual(children)
  })

  test('Properties of created VirdNode are not referenced.', () => {
    const type = randomText()
    const properties: VirdNode['properties'] = { test: randomText() }
    const children = [createNodeFromString(randomText())]

    const virdNode: VirdNode = createNodeFromString(type, properties, children)
    expect(virdNode.properties).not.toBe(properties)
    expect(virdNode.children).not.toBe(children)

    properties.addProperty = randomText()
    children.push(createNodeFromString(randomText()))

    expect(virdNode.properties).not.toEqual(properties)
    expect(virdNode.children).not.toEqual(children)
  })
})
