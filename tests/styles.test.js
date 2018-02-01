/* eslint-env jest */

import {
  hasEqualStyle,
  findStyleBy,
  getStyles,
} from '../src/styles'

import singleParPDF from './fixtures/single-paragraph.json'

describe('hasEqualStyle', () => {
  test('returns true if styles match', () => {
    const item1 = {
      fontName: 'someFont',
      height: 5,
    }
    const item2 = {
      fontName: 'someFont',
      height: 5,
    }

    const result = hasEqualStyle(item1, item2)
    expect(result).toBe(true)
  })

  test('returns false if styles do not match', () => {
    const item1 = {
      fontName: 'someFont',
      height: 15,
    }
    const item2 = {
      fontName: 'someFont',
      height: 5,
    }

    const result = hasEqualStyle(item1, item2)
    expect(result).toBe(false)
  })

  test('is curried function', () => {
    const item1 = {
      fontName: 'someFont',
      height: 15,
    }
    const item2 = {
      fontName: 'someFont',
      height: 5,
    }

    const partial = hasEqualStyle(item1)
    expect(partial).toBeInstanceOf(Function)

    const result = partial(item2)
    expect(result).toBe(false)
  })
})

describe('findStyleBy', () => {
  test('if not found adds item style', () => {
    const style1 = {
      fontName: 'someFont',
      height: 15,
      weight: 1,
    }
    const style2 = {
      fontName: 'someFont',
      height: 5,
      weight: 1,
    }
    const item = {
      fontName: 'someFont',
      height: 5,
      text: 'k',
    }

    const partial = findStyleBy(hasEqualStyle)
    const result = partial([style1], item)

    expect(result).toBeInstanceOf(Array)
    expect(result.length).toBe(2)
    expect(result).toEqual([style1, style2])
  })

  test('if found, increases style weight by text.length ', () => {
    const item1 = {
      fontName: 'someFont',
      height: 15,
      text: 'a',
    }
    const item2 = {
      fontName: 'someFont',
      height: 10,
      text: 'ab',
    }
    const item3 = {
      fontName: 'someFont',
      height: 10,
      text: 'abc',
    }

    const partial = findStyleBy(hasEqualStyle)
    const result = [item1, item2, item3].reduce(partial, [])

    expect(result).toBeInstanceOf(Array)
    expect(result.length).toBe(2)
    expect(result).toEqual([
      {
        fontName: 'someFont',
        height: 15,
        weight: 1,
      },
      {
        fontName: 'someFont',
        height: 10,
        weight: 5,
      },
    ])
  })
})

describe('getStyles', () => {
  test.skip('getStyles works', () => {
    const data = singleParPDF.pages[0].map(x => new Item(x))
    const block = new Block(data)
    const result = block.getStyles()
    expect(result).toBeInstanceOf(Array)
    expect(result.length).toBe(2)
    expect(result).toContainEqual({
      fontName: 'g_d10_f4',
      height: 12,
      weight: 164,
    })
    expect(result).toContainEqual({
      fontName: 'g_d10_f3',
      height: 12,
      weight: 87,
    })
  })
})
