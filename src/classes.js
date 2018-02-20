import { orderByPosition } from './order-items'
import orderBy from 'lodash/fp/orderBy'
import flatten from 'lodash/fp/flatten'

// import { detergent } from 'detergent'

/**
 * An Item instance maps some properties of an text item from PDFJS
 *
 * @export
 * @class Item
 */
export class Item {
  constructor (item) {
    if (item) {
      const { str, width, fontName } = item
      const [, , , height, left, bottom] = item.transform

      this.fontName = fontName
      this.text = str.replace(/[\u200B\u200E\u200F\u200A]/g, '')

      this.height = this.lineHeight = Math.round(height)
      this.width = Math.round(width)
      this.bottom = Math.round(bottom)
      this.left = Math.round(left)

      this.top = this.bottom + this.height
      this.right = this.left + this.width
    }
  }
  static from () {
    const item = [...arguments].reduce((item, arg) => {
      if (
        arg.transform &&
        arg.str &&
        arg.width &&
        arg.fontName
      ) {
        return Object.assign(new Item(arg), item)
      } else {
        return Object.assign(item, arg)
      }
    }, new Item())
    return item
  }
}

/**
 * A Block instance represents a group of Items
 * @export
 * @class Block
 */
export class Block {
  constructor (items, listItem) {
    this.items = orderByPosition(items)
    this.listItem = listItem

    this.text = this.items
      .reduce((r, i, n) => r + i.text, '')
      .trim()
    this.top = this.items.reduce(
      (r, { top }) => Math.max(r, top),
      0,
    )
    this.right = this.items.reduce(
      (r, { right }) => Math.max(r, right),
      0,
    )
    this.bottom = this.items.reduce(
      (r, { bottom }) => Math.min(r, bottom),
      Infinity,
    )
    this.left = this.items.reduce(
      (r, { left }) => Math.min(r, left),
      Infinity,
    )
    this.height = this.top - this.bottom
    this.width = this.right - this.left
  }

  static from () {
    const { items, listItem } = flatten([...arguments]).reduce(
      ({ items, listItem }, item) => {
        switch (item.constructor) {
          case Block:
            return {
              items: [...items, ...item.items],
              listItem: item.listItem,
            }
          case Item:
            if (item.listItem) {
              return { items, listItem: item }
            } else {
              return { items: [...items, item], listItem }
            }
          default:
            if (
              item.listItem &&
              item.listItem.constructor === Item
            ) {
              return { items, listItem: item.listItem }
            } else {
              throw new Error(
                `Block.from: invalid input type (${
                  item.constructor.name
                })`,
              )
            }
        }
      },
      { items: [] },
    )
    // get rid of duplicates
    const set = new Set(items)
    set.delete(listItem)
    return new Block([...set], listItem)
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

  // fontName = most common item height
  get fontName () {
    const fontNameByFrequency = [
      ...this.items.reduce((map, { fontName }) => {
        const instances = map.get(fontName) || 0
        return map.set(fontName, instances + 1)
      }, new Map()),
    ].map(([fontName, frequency]) => ({ fontName, frequency }))

    const mostFrequentFontName = orderBy(
      'frequency',
      'desc',
      fontNameByFrequency,
    )[0].fontName

    return mostFrequentFontName
  }
  set fontName (n) {
    return undefined
  }
}
