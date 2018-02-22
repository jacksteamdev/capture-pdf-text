/* eslint-env jest */
import { Item } from '../src/class.item'
import { Block } from '../src/class.block'

import {
  isCloseBy,
  secondIsNotList,
  padItem,
  areNeighbors,
} from '../src/rules.utils'

describe('isCloseBy', () => {
  test('returns true if item is in range', () => {
    const keys = ['low', 'high']
    const item1 = { low: 1, high: 4 }
    const item2 = { low: 3, high: 4 }
    const result = isCloseBy(keys, item1, item2)
    expect(result).toBe(true)
  })
  test('returns false if item is not in range', () => {
    const keys = ['low', 'high']
    const item1 = { low: 1, high: 4 }
    const item2 = { low: 5, high: 6 }
    const result = isCloseBy(keys, item1, item2)
    expect(result).toBe(false)
  })
})

describe('secondIsNotList', () => {
  test('returns true if item2 is not a listItem', () => {
    const item1 = Item.from(
      {
        fontName: 'Helvetica',
        text: 'Puro, Chile, es tu cielo azulado',
        lineHeight: 12,
        height: 12,
        width: 165,
        bottom: 709,
        left: 54,
        top: 721,
        right: 219,
      },
      { listItem: true },
    )
    const item2 = Item.from(
      {
        fontName: 'Helvetica',
        text: 'uras brisas te cruzan también',
        lineHeight: 12,
        height: 12,
        width: 157,
        bottom: 692,
        left: 233,
        top: 704,
        right: 390,
      },
      { listItem: false },
    )

    const partial = secondIsNotList(item1)
    const result = partial(item2)
    expect(result).toBe(true)
  })

  test('returns false if item2 is a listItem', () => {
    const item1 = Item.from(
      {
        fontName: 'Helvetica',
        text: 'Puro, Chile, es tu cielo azulado',
        lineHeight: 12,
        height: 12,
        width: 165,
        bottom: 709,
        left: 54,
        top: 721,
        right: 219,
      },
      { listItem: true },
    )
    const item2 = Item.from(
      {
        fontName: 'Helvetica',
        text: 'uras brisas te cruzan también',
        lineHeight: 12,
        height: 12,
        width: 157,
        bottom: 709,
        left: 233,
        top: 721,
        right: 390,
      },
      { listItem: true },
    )
    const result = secondIsNotList(item1, item2)
    expect(result).toBe(false)
  })
})

describe('padItem', () => {
  test('expands item boundries', () => {
    const item1 = {
      left: 1,
      right: 11,
      bottom: 1,
      top: 2,
      width: 10,
      lineHeight: 1,
    }
    const result1 = padItem(item1)
    expect(result1).toEqual({
      left: 0,
      right: 12,
      bottom: 0,
      top: 3,
    })
  })
})

describe('areNeighbors', () => {
  test('true if two items are adjacent', () => {
    const items = [
      {
        id: 0,
        bottom: 2,
        top: 4,
        left: 2,
        right: 4,
        width: 2,
        lineHeight: 2,
      },
      {
        id: 1,
        bottom: 5,
        top: 6,
        left: 5,
        right: 6,
        width: 1,
        lineHeight: 1,
      },
      {
        id: 2,
        bottom: 1,
        top: 2,
        left: 1,
        right: 2,
        width: 1,
        lineHeight: 1,
      },
      {
        id: 3,
        bottom: 0,
        top: 10,
        left: 0,
        right: 1,
        width: 1,
        lineHeight: 10,
      },
      {
        id: 4,
        bottom: 8,
        top: 9,
        left: 8,
        right: 9,
        width: 1,
        lineHeight: 1,
      },
      {
        id: 5,
        bottom: 8,
        top: 9,
        left: 9,
        right: 10,
        width: 1,
        lineHeight: 1,
      },
      {
        id: 6,
        bottom: 9,
        top: 10,
        left: 8,
        right: 9,
        width: 1,
        lineHeight: 1,
      },
      {
        id: 7,
        bottom: 9,
        top: 10,
        left: 9,
        right: 10,
        width: 1,
        lineHeight: 1,
      },
      {
        id: 8,
        bottom: 0,
        top: 1,
        left: 1,
        right: 10,
        width: 9,
        lineHeight: 1,
      },
    ]

    expect(areNeighbors(items[0], items[1])).toBe(true)
    expect(areNeighbors(items[1], items[0])).toBe(true)
    expect(areNeighbors(items[2], items[3])).toBe(true)
    expect(areNeighbors(items[3], items[8])).toBe(true)
    expect(areNeighbors(items[1], items[4])).toBe(false)
    expect(areNeighbors(items[1], items[2])).toBe(false)
    expect(areNeighbors(items[4], items[3])).toBe(false)
  })
  test('real world example 1', () => {
    const item = {
      fontName: 'Helvetica',
      text: 'uras brisas te cruzan también',
      lineHeight: 12,
      height: 12,
      width: 157,
      bottom: 709,
      left: 233,
      top: 721,
      right: 390,
    }
    const block = {
      fontName: 'Helvetica',
      text: 'first block',
      lineHeight: 12,
      height: 12,
      width: 157,
      bottom: 694,
      left: 54,
      top: 721,
      right: 373,
    }
    expect(areNeighbors(block, item)).toBe(true)
  })
  test('it matches blocks to items', () => {
    const item1 = new Item({
      str: 'item1',
      dir: 'ltr',
      width: 50,
      height: 12,
      transform: [12, 0, 0, 12, 0, 0],
      fontName: 'Helvetica',
    })
    const item2 = new Item({
      str: 'item2',
      dir: 'ltr',
      width: 50,
      height: 12,
      transform: [12, 0, 0, 12, 50, 0],
      fontName: 'Helvetica',
    })
    const item3 = new Item({
      str: 'item3',
      dir: 'ltr',
      width: 50,
      height: 12,
      transform: [12, 0, 0, 12, 100, 0],
      fontName: 'Helvetica',
    })

    const block = Block.from(item1, item2)
    const result = areNeighbors(block, item3)
    expect(result).toBe(true)
  })
})
