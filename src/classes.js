import { orderByPosition } from './order-items'

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

    this.style = { fontName, height }
    this.text = str

    this.height = height
    this.width = width

    this.top = bottom + height
    this.right = left + width
    this.bottom = bottom
    this.left = left
  }
}

export class Block {
  constructor (items) {
    // TODO: Make array property of block
    // TODO: Adjust this keyword usage
    this.__items = items
  }

  getStyles () {
    const styleSet = this.items.reduce((r, { style, text }) => {
      const isSameStyle = ({ fontName, height }) =>
        fontName === style.fontName && height === style.height

      const result = [...r].find(isSameStyle) || style
      // Increase weight by text.length or,
      // if weight is undefined, set weight to text.length
      result.weight = result.weight + text.length || text.length

      return r.add(result)
    }, new Set())

    return (
      // Spread into array and sort by descending weight
      [...styleSet].sort((a, b) => b.weight - a.weight)
    )
  }

  getRawText () {
    return this.items.reduce((r, i) => r + i.text, '')
  }

  get text () {
    return this.items
      .reduce((r, i, n) => `${r} ${i.text.trim()}`, '')
      .trim()
  }
  set text (t) {
    return undefined
  }

  // this.items.top = bottom + height
  get top () {
    return this.items.reduce((r, { top }) => Math.max(r, top), 0)
  }
  set top (n) {
    return undefined
  }

  // this.items.right = left + width
  get right () {
    return this.items.reduce(
      (r, { right }) => Math.max(r, right),
      0,
    )
  }
  set right (n) {
    return undefined
  }

  // this.items.bottom = bottom
  get bottom () {
    return this.items.reduce(
      (r, { bottom }) => Math.min(r, bottom),
      Infinity,
    )
  }
  set bottom (n) {
    return undefined
  }

  // this.items.left = left
  get left () {
    return this.items.reduce(
      (r, { left }) => Math.min(r, left),
      Infinity,
    )
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

  get items () {
    const ordered = orderByPosition(this.__items)
    return ordered
  }

  set items (x) {
    return undefined
  }
}
