import { virdNodeTypes } from '../../src/vird-node/vird-node-types'

describe('VirdNodeTypes', () => {
  test('node types.', () => {
    const types = {
      text: document.createTextNode('').nodeName,
      comment: document.createComment('').nodeName,
      fragment: document.createDocumentFragment().nodeName
    }

    expect(types).toEqual(virdNodeTypes)
  })
})
