import orderBy from 'lodash/fp/orderBy'
import flatten from 'lodash/fp/flatten'
import trimEnd from 'lodash/fp/trimEnd'
import trimStart from 'lodash/fp/trimStart'

import { Item } from '../src/class.item'
/**
 * A Block instance represents a group of Items
 * @export
 * @class Block
 */
export class Block {
  constructor (items, listItem) {
    this.items = Block.order(items)
    this.listItem = listItem

    this.text = Block.getText(this.items)
    this.lineHeight = Block.frequency(
      'lineHeight',
      Math.max,
      items,
    )
    this.fontName = Block.frequency('fontName', Math.max, items)

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
              throw new TypeError(
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
        if (
          prev &&
          prev.bottom > item.top &&
          prev.right > item.left
        ) {
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

  static frequency (key, fn, items) {
    return [
      ...items.reduce((map, item) => {
        const value = item[key]
        const instances = map.get(value) || 0
        return map.set(value, instances + item.text.length)
      }, new Map()),
    ]
      .map(([value, frequency]) => ({ value, frequency }))
      .reduce((r, { value, frequency }) => {
        return fn(r.frequency, frequency) === frequency
          ? { value, frequency }
          : r
      }).value
  }
  static order (items) {
    const iteratees = ['bottom', 'right']
    const orders = ['desc', 'asc']
    const ordered = orderBy(iteratees, orders, items)

    return ordered
  }
}
