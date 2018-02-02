/* eslint-env jest */

import {
  orderByPosition,
  orderTTB,
  orderLTR,
} from '../src/order-items'

describe('orderByPosition', () => {
  test('It orders correctly', () => {
    const item1 = {
      bottom: 1,
      right: 0,
    }
    const item2 = {
      bottom: 1,
      right: 2,
    }
    const item3 = {
      bottom: 0,
      right: 1,
    }

    const result = orderByPosition([item2, item1, item3])

    expect(result).toBeInstanceOf(Array)
    expect(result.length).toBe(3)
    expect(result).toEqual([item1, item2, item3])
  })
})

describe('orderLTR', () => {
  test('should order correctly left to right', () => {
    const item1 = {
      left: 1,
    }
    const item2 = {
      left: 2,
    }
    const item3 = {
      left: 3,
    }

    const result = orderLTR([item2, item1, item3])

    expect(result).toBeInstanceOf(Array)
    expect(result.length).toBe(3)
    expect(result).toEqual([item1, item2, item3])
  })
})

describe('orderTTB', () => {
  test('should order correctly top to bottom', () => {
    const item1 = {
      top: 3,
    }
    const item2 = {
      top: 2,
    }
    const item3 = {
      top: 1,
    }

    const result = orderTTB([item2, item1, item3])

    expect(result).toBeInstanceOf(Array)
    expect(result.length).toBe(3)
    expect(result).toEqual([item1, item2, item3])
  })
})
