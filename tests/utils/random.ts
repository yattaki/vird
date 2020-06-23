export function randomText(length = 10, chars = 'abcdefghijklmnopqrstuvwxyz') {
  const maxIndex = chars.length
  let result = ''
  while (length > 0) {
    result += chars[Math.floor(Math.random() * maxIndex)]
    length--
  }

  return result
}
