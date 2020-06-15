<p align="center">
  <img width="100" src="./vird-icon.svg" alt="vird logo">
</p>

![npm version](https://img.shields.io/npm/v/vird)
![npm type definitions](https://img.shields.io/npm/types/vird)
![npm bundle size](https://img.shields.io/bundlephobia/min/vird)
![npm downloads](https://img.shields.io/npm/dt/vird)
![npm license](https://img.shields.io/npm/l/vird)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# Vird

Vird is a great virtual DOM library that can extend rendering.

## Installation

Read from [CDN](https://cdn.jsdelivr.net/npm/vird/dist/index.iife.min.js).

```HTML
<script src="https://cdn.jsdelivr.net/npm/vird/dist/index.iife.min.js"></script>
```

Install from [NPM](https://www.npmjs.com/package/vird).

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

### Example 01 Element render.

```typescript
// Example 01 Element render.
const helloVirdElement = vird.createElement('div', 'Hallo World !')
vird.renderer.render(document.body, helloVirdElement)
```

### Example 02 Multiple elements render.

```typescript
// Example 02 Multiple elements render.
const virdElements = [
  vird.createElement('div', 'Multiple elements render.'),
  vird.createElement('div', { style: 'color: #00d7d7' }, 'Vird is very easy !')
]
vird.renderer.render(document.body, ...virdElements)
```

### Example 03 Automatic re render.

```typescript
// Example 03 Automatic re render.
const replaceVirdElement = vird.createElement('div', { textContent: '{ text : Before Text. }' })
vird.renderer.render(document.body, replaceVirdElement)

setTimeout(() => {
  replaceVirdElement.setState({ text: 'After Text.' }) // re rendering.
}, 1000)
```

### Example 04 TemplateElement render.

```HTML
<template id="template">
  <div>Template sample.</div>
  <div>{ text }</div>
</template>
```

```typescript
// Example 04 TemplateElement render.
const templateElement = document.getElementById('template')

const cloneElement = document.importNode(templateElement.content, true)
const templateVirdElement = vird.createElement(cloneElement, true)
templateVirdElement.setState({ text: 'Data binding.' })
templateVirdElement.setAcceptParentStateOfChildren(true) // Child element accepts parent state.

vird.renderer.render(document.body, templateVirdElement)
```

## License

[MIT licensed.](https://github.com/yattaki/vird/blob/master/LICENSE)
