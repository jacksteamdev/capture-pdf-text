/* eslint-env jest */

import {
  createBlocks,
  blocksAreNear,
  toRangeBy,
  blocksAreAligned,
  blocksAreRelated,
  concatIfAny,
  splitBy,
} from '../src/blocks'
import { Block, Item } from '../src/classes'
import singleParPDF from './fixtures/single-paragraph.json'
import isEqual from 'lodash/fp/isEqual'
import identity from 'lodash/fp/identity'

describe('splitBy', () => {
  test('splits numbers by value', () => {
    const nums = [1, 1, 1, 2, 2, 2, 3, 3, 3]
    const result = splitBy(identity, isEqual, nums)
    expect(result).toBeInstanceOf(Array)
    expect(result.length).toBe(3)
    expect(result).toEqual([[1, 1, 1], [2, 2, 2], [3, 3, 3]])
  })

  test('splits objects by property value', () => {
    const items = [
      { x: 1 },
      { x: 2 },
      { x: 1 },
      { x: 3 },
      { x: 2 },
    ]
    const result = splitBy('x', isEqual, items)
    expect(result.length).toBe(3)
    expect(result).toEqual([
      [{ x: 1 }, { x: 1 }],
      [{ x: 2 }, { x: 2 }],
      [{ x: 3 }],
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

describe('concatIfAny', () => {
  test('concats arrays if predicated', () => {
    const concatIfAnyEqual = concatIfAny(isEqual)
    const result = concatIfAnyEqual([1, 2, 3], [3, 4, 5])
    expect(result).toEqual([[1, 2, 3, 3, 4, 5]])
  })

  test('does not concat arrays if not predicated', () => {
    const concatIfAnyEqual = concatIfAny(isEqual)
    const result = concatIfAnyEqual([1, 2, 3], [4, 5, 6])
    expect(result).toEqual([[1, 2, 3], [4, 5, 6]])
  })
})
