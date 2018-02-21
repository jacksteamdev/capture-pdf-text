import { orderByPosition } from './order-items'
import orderBy from 'lodash/fp/orderBy'
import flatten from 'lodash/fp/flatten'
import trimEnd from 'lodash/fp/trimEnd'
import trimStart from 'lodash/fp/trimStart'
import conforms from 'lodash/fp/conforms'
import isString from 'lodash/fp/isString'
import isNumber from 'lodash/fp/isNumber'
import isObject from 'lodash/fp/isObject'

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

  static from (item, props) {
    const itemSpec = conforms({
      transform: Array.isArray,
      str: isString,
      width: isNumber,
      fontName: isString,
    })
    if (!isObject(props)) {
      props = {}
    }
    if (itemSpec(item)) {
      return Object.assign(new Item(item), props)
    } else {
      return Object.assign(new Item(), item, props)
    }
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

    this.text = Block.getText(this.items)

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
            if (item.listItem) {
              return {
                items: [...items, ...item.items],
                listItem: item.listItem,
              }
            } else {
              return {
                items: [...items, ...item.items],
                listItem,
              }
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

  static getText (items) {
    return items.reduce(
      ({ text, prev }, item) => {
        if (prev && prev.right > item.left) {
          return {
            text: `${trimEnd(text)} ${trimStart(item.text)}`,
            prev: item,
          }
        } else {
          return { text: text + item.text, prev: item }
        }
      },
      { text: '', prev: null },
    ).text
  }
  // lineHeight = most common item height
  get lineHeight () {
    const heightByFrequency = [
      ...this.items.reduce((map, { height, text }) => {
        const instances = map.get(height) || 0
        return map.set(height, instances + text.length)
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
      ...this.items.reduce((map, { fontName, text }) => {
        const instances = map.get(fontName) || 0
        return map.set(fontName, instances + text.length)
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
