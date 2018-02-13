/* eslint-env jest */

import {
  isEmpty,
  splitBy,
  createBlocks,
  blocksAreNear,
  toRangeBy,
  blocksAreAligned,
  blocksAreRelated,
  predicateSome,
  groupItems,
  groupIntoBlocks,
} from '../src/blocks'
import { Block, Item } from '../src/classes'
import singleParPDF from './fixtures/single-paragraph.json'
import isEqual from 'lodash/fp/isEqual'
import identity from 'lodash/fp/identity'
import multiParPDF from './fixtures/multi-paragraph.json'

describe('isEmpty', () => {
  test('returns true for empty item', () => {
    const result = isEmpty({ text: ' ' })
    expect(result).toBe(true)
  })
  test('returns false for item with text', () => {
    const result = isEmpty({ text: 'Jack' })
    expect(result).toBe(false)
  })
})

describe('splitBy', () => {
  test('splits numbers by value', () => {
    const nums = [1, 1, 1, 2, 2, 2, 3, 3, 3]
    const result = splitBy(null, isEqual, nums)
    expect(result).toBeInstanceOf(Array)
    expect(result.length).toBe(3)
    expect(result).toEqual([[1, 1, 1], [2, 2, 2], [3, 3, 3]])
  })

  test('splits objects by property value', () => {
    const items = [
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      { x: 1, y: 3 },
      { x: 3, y: 4 },
      { x: 2, y: 5 },
    ]
    const result = splitBy('x', isEqual, items)
    // expect(result.length).toBe(3)
    expect(result).toEqual([
      [{ x: 1, y: 1 }, { x: 1, y: 3 }],
      [{ x: 2, y: 2 }, { x: 2, y: 5 }],
      [{ x: 3, y: 4 }],
    ])
  })
})

describe('createBlocks', () => {
  test('creates an array of blocks', () => {
    const data = singleParPDF.pages[0].map(x => new Item(x))
    const result = createBlocks([data, data])

    expect(result).toBeInstanceOf(Array)
    expect(result.length).toBe(2)
    expect(result[0]).toBeInstanceOf(Block)
    expect(result[1]).toBeInstanceOf(Block)
  })
})

describe('blocksAreNear', () => {
  test('if blocks are near returns TRUE', () => {
    const result = blocksAreNear(
      { top: 5, bottom: 1, lineHeight: 1 },
      { top: 10, bottom: 6, lineHeight: 1 },
    )
    expect(result).toBe(true)
  })
  test('if blocks are near returns FALSE', () => {
    const result = blocksAreNear(
      { top: 5, bottom: 1, lineHeight: 1 },
      { top: 10, bottom: 7, lineHeight: 1 },
    )
    expect(result).toBe(false)
  })
})

describe('toRangeBy', () => {
  test('returns correct range', () => {
    expect(toRangeBy(2, 3)).toEqual([2, 4])
  })
})

describe('blocksAreAligned', () => {
  test('returns true if blocks are aligned', () => {
    const partial = blocksAreAligned('left', 1)
    const result = partial({ left: 0 }, { left: 0.1 })
    expect(result).toBe(true)
  })
})

describe('blocksAreRelated', () => {
  test('returns true if blocks are related', () => {
    const result = blocksAreRelated(
      { top: 5, bottom: 1, lineHeight: 1, left: 1 },
      { top: 10, bottom: 6, lineHeight: 1, left: 1 },
    )
    expect(result).toBe(true)
  })

  test('returns false if blocks are not close vertically', () => {
    const result = blocksAreRelated(
      { top: 4, bottom: 1, lineHeight: 1, left: 1 },
      { top: 10, bottom: 6, lineHeight: 1, left: 1 },
    )
    expect(result).toBe(false)
  })

  test('returns false if blocks are not left aligned', () => {
    const result = blocksAreRelated(
      { top: 5, bottom: 1, lineHeight: 1, left: 1 },
      { top: 10, bottom: 6, lineHeight: 1, left: 1.5 },
    )
    expect(result).toBe(false)
  })

  test('returns false if blocks are not related at all', () => {
    const result = blocksAreRelated(
      { top: 5, bottom: 1, lineHeight: 1, left: 1 },
      { top: 10, bottom: 8, lineHeight: 1, left: 1.5 },
    )
    expect(result).toBe(false)
  })
})

describe('predicateSome', () => {
  test('returns true if predicated', () => {
    const predicateSomeEqual = predicateSome(isEqual)
    const result = predicateSomeEqual([1, 2, 3], [3, 4, 5])
    expect(result).toBe(true)
  })

  test('returns false if not predicated', () => {
    const predicateSomeEqual = predicateSome(isEqual)
    const result = predicateSomeEqual([1, 2, 3], [4, 5, 6])
    expect(result).toBe(false)
  })
})

describe('groupItems', () => {
  test('group overlapping items', () => {
    const data = multiParPDF.pages[0]
      .map(x => new Item(x))
      .filter(item => !isEmpty(item))
    const result = groupItems(data)
    expect(result).toBeInstanceOf(Array)
    expect(result.length).toBe(5)
  })
})

describe('groupIntoBlocks', () => {
  test.only('group items by paragraph', () => {
    const data = multiParPDF.pages[0].map(x => new Item(x))
    const result = groupIntoBlocks(data)
    expect(result).toBeInstanceOf(Array)
    expect(result.length).toBe(5)
  })
})
