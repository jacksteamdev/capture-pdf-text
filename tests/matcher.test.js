/* eslint-env jest */

import { objectMatcher, toPredicate } from '../src/matcher'
import isEqual from 'lodash/fp/isEqual'

describe('toPredicate', () => {
  test('partially applies comparator', () => {
    const item1 = { x: 1 }
    const item2 = { x: 2 }
    const item3 = { x: 1 }
    const item4 = { x: 1, y: 5 }
    const predicate = toPredicate(item1, isEqual)
    expect(predicate(item2)).toBe(false)
    expect(predicate(item3)).toBe(true)
    expect(predicate(item4)).toBe(false)
  })
  test('partially applies comparator object', () => {
    const item1 = { x: 1, y: 9 }
    const item2 = { x: 2, y: 10 }
    const item3 = { x: 1, y: 11 }
    const comparator = { x: isEqual }
    const predicate = toPredicate(item1, comparator)
    expect(predicate(item2)).toBe(false)
    expect(predicate(item3)).toBe(true)
  })
})

describe('objectMatcher', () => {
  test('matches by comparator object', () => {
    const item1 = { height: 12, fontName: 'Times' }
    const item2 = { height: 13, fontName: 'Times' }
    const item3 = { height: 12, fontName: 'Times' }
    const item4 = { height: 12, fontName: 'Arial' }
    const areSameStyle = objectMatcher([
      {
        height: isEqual,
        fontName: isEqual,
      },
    ])
    expect(areSameStyle).toBeInstanceOf(Function)
    expect(areSameStyle(item1, item3)).toBe(true)
    expect(areSameStyle(item1, item2)).toBe(false)
    expect(areSameStyle(item1, item4)).toBe(false)
  })
  test.skip('matches by mixed comparators', () => {
    const item1 = { height: 12, fontName: 'Times' }
    const item2 = { height: 13, fontName: 'Times' }
    const item3 = { height: 12, fontName: 'Times' }
    const item4 = { height: 12, fontName: 'Arial' }
    const areSameStyleNeighbors = objectMatcher([
      {
        height: isEqual,
        fontName: isEqual,
      },
      areNeighbors,
    ])
    expect(areSameStyleNeighbors(item1, item2)).toBe(true)
    expect(areSameStyleNeighbors(item1, item3)).toBe(false)
  })
})
