import { orderByPosition } from './order-items'
import orderBy from 'lodash/fp/orderBy'

/**
 * An Item instance maps some properties of an text item from PDFJS
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

    this.height = this.lineHeight = Math.round(height)
    this.width = Math.round(width)
    this.bottom = Math.round(bottom)
    this.left = Math.round(left)

    this.top = this.bottom + this.height
    this.right = this.left + this.width
  }
}

/**
 * A Block instance represents a group of Items
 * @export
 * @class Block
 */
export class Block {
  constructor (items) {
    this.__items = items
  }

  static from () {
    const items = [...arguments].reduce(
      (r, item) =>
        item.items ? [...r, ...item.items] : [...r, item],
      [],
    )
    const set = new Set(items)
    return new Block([...set])
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

  // lineHeight = most common item height
  get lineHeight () {
    const heightByFrequency = [
      ...this.items.reduce((map, { height }) => {
        const instances = map.get(height) || 0
        return map.set(height, instances + 1)
      }, new Map()),
    ].map(([height, frequency]) => ({ height, frequency }))

    const mostFrequentHeight = orderBy(
      'frequency',
      'desc',
      heightByFrequency,
    )[0].height

    return mostFrequentHeight
  }
  set lineHeight (n) {
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
