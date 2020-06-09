// @ts-check

import * as vird from '../dist/index.js'

(async () => {
  const templateElement = document.getElementById('template')

  // Example 01
  const renderedVElements = await new Promise((resolve) => {
    const virdNode = vird.Vird.createNode('div', 'Hallo World!!')
    const renderedVElements = vird.VirdDom.renderer.render(document.body, virdNode)

    setTimeout(() => { resolve(renderedVElements) }, 1000)
  })

  // Example 02
  await new Promise((resolve) => {
    const virdNodes = [
      ...renderedVElements,
      vird.Vird.createNode('div', { style: 'color: #4caf50' }, 'Vird is very easy!!')
    ]
    vird.VirdDom.renderer.render(document.body, ...virdNodes)

    setTimeout(() => { resolve() }, 1000)
  })

  // Example 03
  await new Promise((resolve) => {
    // @ts-ignore
    const cloneElement = document.importNode(templateElement.content, true)
    const virdNode = vird.VirdDom.createNode(cloneElement)

    vird.VirdDom.renderer.render(document.body, virdNode)

    setTimeout(() => { resolve() }, 1000)
  })

  // Example 05
  await new Promise((resolve) => {
    const effect = vird.VirdDom.renderer.createEffect(document.body, (value) => value, 'Before text.')
    const render = () => vird.Vird.createFragment(
      vird.Vird.createNode('div', 'Effect rendering sample.'),
      vird.Vird.createNode('div', effect.value)
    )

    vird.VirdDom.renderer.render(document.body, render)

    setTimeout(() => { effect.setEffect('After text.') }, 1000)

    setTimeout(() => { resolve() }, 2000)
  })

  // Example 04
  await new Promise((resolve) => {
    class Component {
      constructor () {
        this.effect = vird.VirdDom.renderer.createDispatcher(document.body)
        this.state = { count: 0 }
      }

      setState (state) {
        this.state = { ...this.state, ...state }
        this.effect()
      }

      render () {
        return () => vird.Vird.createFragment(
          vird.Vird.createNode('div', 'Component rendering sample.'),
          vird.Vird.createNode('div', `Count ${this.state.count}.`)
        )
      }
    }

    const component = new Component()
    vird.VirdDom.renderer.render(document.body, component.render())

    setInterval(() => { component.setState({ count: component.state.count + 1 }) }, 1000)

    setTimeout(() => { resolve() }, 1000)
  })
})()
