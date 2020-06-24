export function updateAttribute(
  element: Element,
  name: string,
  value?: string | number | boolean | string[] | null
) {
  if (value != null) {
    const attrValue = Array.isArray(value) ? value.join(' ') : String(value)

    switch (name) {
      case 'value':
        ;(element as HTMLInputElement).value = attrValue
        break

      default:
        element.setAttribute(name, attrValue)
        break
    }
  } else {
    element.removeAttribute(name)
  }
}
