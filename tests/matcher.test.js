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
