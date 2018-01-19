/**
 * A Item instance maps some properties of an text item from PDFJS
 *
 * @export
 * @class Item
 */
export class Item {
  constructor (item) {
    const { str, width, fontName } = item
    const [, , , height, left, bottom] = item.transform

    this.fontName = fontName
    this.text = str

    this.height = height
    this.width = width

    this.top = bottom + height
    this.right = left + width
    this.bottom = bottom
    this.left = left
  }
}

export class Block extends Array {
  getRawText () {
    return this.reduce((r, i) => r + i.text, '')
  }

  get text () {
    return this.reduce((r, i, n) => `${r} ${i.text.trim()}`, '').trim()
  }
  set text (t) {
    return undefined
  }

  // this.top = bottom + height
  get top () {
    return this.reduce((r, { top }) => Math.max(r, top), 0)
  }
  set top (n) {
    return undefined
  }

  // this.right = left + width
  get right () {
    return this.reduce((r, { right }) => Math.max(r, right), 0)
  }
  set right (n) {
    return undefined
  }

  // this.bottom = bottom
  get bottom () {
    return this.reduce((r, { bottom }) => Math.min(r, bottom), Infinity)
  }
  set bottom (n) {
    return undefined
  }

  // this.left = left
  get left () {
    return this.reduce((r, { left }) => Math.min(r, left), Infinity)
  }
  set left (n) {
    return undefined
  }

  // Add getters for dimensions
  get height () {
    return this.top - this.bottom
  }
  set height (n) {
    return undefined
  }

  // this.width = width
  get width () {
    return this.right - this.left
  }
  set width (n) {
    return undefined
  }
}
