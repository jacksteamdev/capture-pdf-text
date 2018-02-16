/* eslint-env jest */

import {
  sameStyleNeighbors,
  sameBlock,
  innerBlock,
} from '../src/matcher.rules'
import { objectMatcher } from '../src/matcher'

describe('sameStyleNeighbors', () => {
  test('matches items that have same style and are neighbors', () => {
    const partial = objectMatcher(sameStyleNeighbors())

    const item1 = { height: 12, fontName: 'Times' }
    const item2 = { height: 13, fontName: 'Times' }
    const item4 = { height: 12, fontName: 'Arial' }
    expect(partial(item1, item2)).toBe(false)
    expect(partial(item1, item4)).toBe(false)

    const item5 = {
      left: 1,
      right: 11,
      bottom: 1,
      top: 2,
      width: 10,
      lineHeight: 1,
      height: 12,
      fontName: 'Arial',
    }
    const item6 = {
      left: 2,
      right: 3,
      bottom: 3,
      top: 12,
      width: 1,
      lineHeight: 8,
      height: 12,
      fontName: 'Arial',
    }
    expect(partial(item5, item6)).toBe(true)
  })
})

describe('sameBlock', () => {
  test('match items that are left aligned', () => {
    const partial = objectMatcher(sameBlock(1, 2))
    const item1 = {
      left: 1,
      right: 20,
      bottom: 1,
      top: 4,
      width: 19,
      lineHeight: 3,
      height: 3,
      fontName: 'Arial',
    }
    const item2 = {
      left: 2,
      right: 20,
      bottom: 6,
      top: 9,
      width: 19,
      lineHeight: 3,
      height: 3,
      fontName: 'Arial',
    }
    const item3 = {
      left: 5,
      right: 20,
      bottom: 6,
      top: 9,
      width: 19,
      lineHeight: 3,
      height: 3,
      fontName: 'Arial',
    }
    expect(partial(item1, item2)).toBe(true)
    expect(partial(item1, item3)).toBe(false)
  })
})

describe('innerBlock', () => {
  test('returns true if block is inside', () => {
    const partial = objectMatcher(innerBlock(0))
    const item1 = {
      left: 0,
      right: 3,
      bottom: 0,
      top: 3,
    }
    const item2 = {
      left: 1,
      right: 2,
      bottom: 1,
      top: 2,
    }
    expect(partial(item1, item2)).toBe(true)
  })

  test('returns false if block is outside', () => {
    const partial = objectMatcher(innerBlock(0))
    const item1 = {
      left: 0,
      right: 3,
      bottom: 0,
      top: 3,
    }
    const item2 = {
      left: 3,
      right: 4,
      bottom: 3,
      top: 4,
    }
    expect(partial(item1, item2)).toBe(false)
  })

  test('returns true if block is fully inside on edge', () => {
    const partial = objectMatcher(innerBlock(0))
    const item1 = {
      left: 0,
      right: 12,
      bottom: 0,
      top: 8,
    }
    const item2 = {
      left: 4,
      right: 8,
      bottom: 4,
      top: 8,
    }
    expect(partial(item1, item2)).toBe(true)
  })

  test('returns false if block is partially inside', () => {
    const partial = objectMatcher(innerBlock(0))
    const item1 = {
      left: 0,
      right: 12,
      bottom: 0,
      top: 8,
    }
    const item2 = {
      left: 4,
      right: 8,
      bottom: 6,
      top: 10,
    }
    expect(partial(item1, item2)).toBe(false)
  })
})
