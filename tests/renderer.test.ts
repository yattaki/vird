import { renderer, createElement } from '../src/index'

describe('Renderer test.', () => {
  const rootElement = document.body

  test('Render', () => {
    const renderElements = [createElement('div')]
    renderer.render(rootElement, ...renderElements)

    const realChildren = [...rootElement.children]
    let index = 0
    const endIndex = Math.max(realChildren.length, renderElements.length)
    while (index < endIndex) {
      const firstChildTag = realChildren[index].tagName.toLocaleLowerCase()
      expect(firstChildTag).toBe(renderElements[index].type)
      index++
    }
  })

  test('Check properties', () => {
    const key = 'style'
    const value = 'display: none;'
    const properties = { [key]: value }
    const virdElement = createElement('div', properties)
    renderer.render(rootElement, virdElement)

    const realElement = rootElement.children[0]
    const attributeValue = realElement.getAttribute(key)
    expect(attributeValue).toBe(value)
  })

  test('Add element', () => {
    const renderElements = [
      createElement('div'),
      createElement('div'),
      createElement('div')
    ]
    renderer.render(rootElement, ...renderElements)
    const oldChildren = [...rootElement.children]

    renderElements.push(createElement('div'))
    renderElements.push(createElement('div'))
    renderElements.push(createElement('div'))
    renderer.render(rootElement, ...renderElements)
    const newChildren = [...rootElement.children]
    expect(oldChildren)
      .toEqual(newChildren.slice(0, oldChildren.length))

    expect(newChildren.length).toBe(renderElements.length)
  })

  test('Remove element', () => {
    const renderElements = [
      createElement('div'),
      createElement('div'),
      createElement('div')
    ]
    renderer.render(rootElement, ...renderElements)
    const oldChildren = [...rootElement.children]

    renderElements.pop()
    oldChildren.pop()
    renderer.render(rootElement, ...renderElements)
    expect(oldChildren).toEqual([...rootElement.children])
  })

  test('Clone render', () => {
    const virdElements = [
      createElement('div'),
      createElement('div'),
      createElement('div')
    ]
    renderer.render(rootElement, ...virdElements)
    const oldChildren = [...rootElement.children]

    const cloneVirdElements = virdElements.map(virdElement => virdElement.clone())
    renderer.render(rootElement, ...cloneVirdElements)
    const newChildren = [...rootElement.children]

    expect(oldChildren).toEqual(newChildren)
  })

  test('Re render', () => {
    renderer.render(
      rootElement,
      createElement('div'),
      createElement('div'),
      createElement('div')
    )

    const oldChildren = [...rootElement.children]
    renderer.reRender(rootElement)
    const newChildren = [...rootElement.children]

    expect(oldChildren).toEqual(newChildren)
  })

  test('Data binding', () => {
    const oldText = Math.random().toString()
    const virdElement = createElement('div', { textContent: '{ text }' })
    virdElement.setState({ text: oldText })
    renderer.render(rootElement, virdElement)

    const realElement = rootElement.children[0]
    expect(realElement.textContent).toBe(oldText)

    const newText = Math.random().toString()
    virdElement.setState({ text: newText })
    expect(realElement.textContent).toBe(newText)
  })
})