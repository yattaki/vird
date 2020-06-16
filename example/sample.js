// @ts-check

import * as vird from '../dist/index.js'

(async () => {
  const timer = 1000
  const templateElement = document.getElementById('template')
  const pause = (time) => new Promise(resolve => {
    setTimeout(() => { resolve() }, time)
  })

  // Example 01 Element render.
  const helloVirdElement = vird.createElement('div', 'Hallo World !')
  vird.renderer.render(document.body, helloVirdElement)

  await pause(timer)

  // Example 02 Multiple elements render.
  const virdElements = [
    vird.createElement('div', 'Multiple elements render.'),
    vird.createElement('div', { style: 'color: #00d7d7' }, 'Vird is very easy !')
  ]
  vird.renderer.render(document.body, ...virdElements)

  await pause(timer)

  // Example 03 Automatic re render.
  const replaceVirdElement = vird.createElement('div', {
    textContent: '{ text : Before Text. }',
    style: '{ style }'
  })
  vird.renderer.render(document.body, replaceVirdElement)

  await pause(timer)

  replaceVirdElement.setState({
    text: 'After Text.',
    style: 'color: #00d7d7;'
  }) // re rendering.

  await pause(timer)

  // Example 04 HTMLTemplateElement render.
  // @ts-ignore
  const cloneElement = document.importNode(templateElement.content, true)
  const templateVirdElement = vird.createElement(cloneElement, true)
  templateVirdElement.setState({ text: 'Data binding.' })
  templateVirdElement.setAcceptParentStateOfChildren(true) // Child element accepts parent state.

  vird.renderer.render(document.body, templateVirdElement)

  await pause(timer)

  // Example 05 Effect render.
  const virdElement = vird.createElement('div', { textContent: '{ text }' })

  const { runEffect } = vird.renderer.createEffect(
    document.body,
    (text) => { virdElement.setState({ text }) }
  )

  runEffect('Wait for effect...')

  vird.renderer.render(document.body, virdElement)

  await pause(timer)

  runEffect('Effect !')
})()
