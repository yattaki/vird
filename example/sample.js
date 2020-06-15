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

  console.log('debug:', 'test')
  const virdElements2 = [
    vird.createElement('div', 'Multiple elements render.'),
    vird.createElement('div', { style: 'color: #00d7d7' }, 'Vird is very easy !')
  ]
  vird.renderer.render(document.body, ...virdElements2)

  await pause(timer * 100)

  // Example 03 Automatic re render.
  const replaceVirdElement = vird.createElement('div', { textContent: '{ text : Before Text. }' })
  vird.renderer.render(document.body, replaceVirdElement)

  await pause(timer)
  replaceVirdElement.setState({ text: 'After Text.' }) // re rendering.
  await pause(timer)

  // Example 04 TemplateElement render.
  // @ts-ignore
  const cloneElement = document.importNode(templateElement.content, true)
  const templateVirdElement = vird.createElement(cloneElement, true)
  templateVirdElement.setState({ text: 'Data binding.' })
  templateVirdElement.setAcceptParentStateOfChildren(true) // Child element accepts parent state.

  vird.renderer.render(document.body, templateVirdElement)
})()
