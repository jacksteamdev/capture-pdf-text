/* eslint-env jest */

import {
  objectMatcher,
  toPredicate,
  areSameStyleNeighbors,
} from '../src/matcher'
import { areNeighbors } from '../src/neighbors'

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
  test('matches by mixed comparators', () => {
    const item1 = { height: 12, fontName: 'Times' }
    const item2 = { height: 13, fontName: 'Times' }
    const item3 = { height: 12, fontName: 'Times' }
    const item4 = { height: 12, fontName: 'Arial' }
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

    expect(areSameStyleNeighbors(item1, item2)).toBe(false)
    expect(areSameStyleNeighbors(item1, item4)).toBe(false)
    expect(areSameStyleNeighbors(item5, item6)).toBe(true)
  })
})
