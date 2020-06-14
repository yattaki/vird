# Vird

![npm version](https://img.shields.io/npm/v/vird)
![npm type definitions](https://img.shields.io/npm/types/vird)
![npm bundle size](https://img.shields.io/bundlephobia/min/vird)
![npm downloads](https://img.shields.io/npm/dt/vird)
![npm license](https://img.shields.io/npm/l/vird)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Vird is a great virtual DOM library that can extend rendering.

## Installation

Read from [CDN](https://cdn.jsdelivr.net/npm/vird/dist/index.iife.min.js).

```HTML
<script src="https://cdn.jsdelivr.net/npm/vird/dist/index.iife.min.js"></script>
```

Install from [npm](https://www.npmjs.com/package/vird).

```bash
npm i vird
```

Import as module.

```typescript
import * as vird from 'vird'
```

Import as required.

```typescript
const vird = required('vird')
```

## Examples

### Example 01

Rendering sample.

```typescript
const virdNode = vird.Vird.createNode('div', 'Hallo World!!')
const renderedVElements = vird.VirdDom.renderer.render(document.body, virdNode)
```

### Example 02

Re-rendering sample.

```typescript
const virdNodes = [
  ...renderedVElements,
  vird.Vird.createNode('div', 'Vird is very easy!!')
]
vird.VirdDom.renderer.render(document.body, ...virdNodes)
```

### Example 03

HTMLTemplateElement rendering sample.

```HTML
<template id="template">
  <div>Template sample.</div>
  <div>Template sample.</div>
  <div>Template sample.</div>
</template>
```

```typescript
const templateElement = document.getElementById('template')
const cloneElement = document.importNode(templateElement.content, true)
const virdNode = vird.VirdDom.createNode(cloneElement)

vird.VirdDom.renderer.render(document.body, virdNode)
```

### Example 04

Effect rendering sample.

```typescript
const effect = vird.VirdDom.renderer.createEffect(document.body, (value) => value, 'Before text.')
const render = () => vird.Vird.createFragment(
  vird.Vird.createNode('div', 'Effect rendering sample.'),
  vird.Vird.createNode('div', effect.value)
)

vird.VirdDom.renderer.render(document.body, render)

setTimeout(() => { effect.setEffect('After text.') }, 1000)
```

### Example 05

Component rendering sample.

```typescript
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
```

## License

[MIT licensed.](https://github.com/yattaki/vird/blob/master/LICENSE)
