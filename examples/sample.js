// eslint-disable-next-line spaced-comment
//@ts-check

import { createNode, render } from '../dist/index.js'

const rootElement = document.getElementById('root')

const baseElement = document.getElementById('base')
const baseVirdNode = createNode(baseElement)
render(rootElement, baseVirdNode)

const runButtonElement = document.getElementById('run')
runButtonElement.addEventListener(
  'click',
  () => {
    async function wait(time) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve()
        }, time)
      })
    }

    const step = 10
    async function run() {
      let addIndex = 0
      // append
      while (addIndex < 6) {
        baseVirdNode.children.unshift(
          createNode(
            'div',
            {
              click: (text => () => {
                console.log('debug:', text)
              })(String(Date.now()))
            },
            'append'
          )
        )

        render(rootElement, baseVirdNode)

        await wait(step)
        addIndex++
      }

      // remove
      let removeIndex = 0
      while (removeIndex < 6) {
        baseVirdNode.children.shift()
        render(rootElement, baseVirdNode)
        await wait(step)
        removeIndex++
      }

      baseVirdNode.children.unshift(
        createNode(`replace-${Date.now().toString(32)}`)
      )

      render(rootElement, baseVirdNode)

      // replace
      let replaceIndex = 0
      while (replaceIndex < 6) {
        const replaceNode = createNode(
          'div',
          `replace-${Date.now().toString(32)}`
        )
        baseVirdNode.children.splice(0, 1, replaceNode)
        render(rootElement, baseVirdNode)
        await wait(step)
        replaceIndex++
      }

      baseVirdNode.children.shift()
      render(rootElement, baseVirdNode)

      await render(rootElement, baseVirdNode)

      requestAnimationFrame(run)
    }
    requestAnimationFrame(run)
  },
  { once: true }
)
runButtonElement.click()
