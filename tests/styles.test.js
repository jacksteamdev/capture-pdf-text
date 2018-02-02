/* eslint-env jest */

import { Item } from '../src/classes'

import {
  Style,
  hasEqualStyle,
  addItemToStyle,
  findAndMutate,
  addItemToStyles,
  getStyles,
} from '../src/styles'

import singleParPDF from './fixtures/single-paragraph.json'

describe('class Style', () => {
  test('constructor works', () => {
    const result = new Style({
      fontName: 'someFont',
      height: 15,
      text: 'a',
    })

    expect(result).toBeInstanceOf(Style)
    expect(result).toHaveProperty('fontName', 'someFont')
    expect(result).toHaveProperty('height', 15)
    expect(result).toHaveProperty('items')

    expect(result.addItem).toBeInstanceOf(Function)
    expect(result.getCharCount).toBeInstanceOf(Function)
    expect(result.items).toBeInstanceOf(Set)
  })

  test('#addItem adds same style item', () => {
    const items = [
      {
        fontName: 'someFont',
        height: 15,
        text: 'a',
      },
      {
        fontName: 'someFont',
        height: 15,
        text: 'bc',
      },
      {
        fontName: 'someFont',
        height: 15,
        text: 'def',
      },
    ]

    const style = new Style(items[0])
    const result = style.addItem(items[1]).addItem(items[2])

    expect(result).toBe(style)
    expect(result.items.size).toBe(3)
    expect(result.getCharCount()).toBe(6)
    expect(result.items)
  })

  test('#addItem does not add different style item', () => {
    const items = [
      {
        fontName: 'someFont',
        height: 15,
        text: 'a',
      },
      {
        fontName: 'someFont',
        height: 11,
        text: 'bc',
      },
      {
        fontName: 'someOtherFont',
        height: 15,
        text: 'de',
      },
      {
        fontName: 'someOtherFont',
        height: 12,
        text: 'fg',
      },
    ]

    const style = new Style(items[0])
    const result = style.addItem(items[1]).addItem(items[2])

    expect(result.items.size).toBe(1)
    expect(result.getCharCount()).toBe(1)
  })

  test('#getCharCount returns number of chars in all items', () => {
    const items = [
      {
        fontName: 'someFont',
        height: 15,
        text: 'a',
      },
      {
        fontName: 'someFont',
        height: 15,
        text: 'bc',
      },
      {
        fontName: 'someFont',
        height: 15,
        text: 'def',
      },
      {
        fontName: 'someFont',
        height: 15,
        text: 'fghi',
      },
    ]

    const style = new Style(items[0])
      .addItem(items[1])
      .addItem(items[2])
      .addItem(items[3])
    const result = style.getCharCount()

    expect(result).toBe(10)
  })
})

describe('hasEqualStyle', () => {
  test('returns true if styles match', () => {
    const a = {
      fontName: 'someFont',
      height: 5,
    }
    const b = {
      fontName: 'someFont',
      height: 5,
    }

    const result = hasEqualStyle(a, b)
    expect(result).toBe(true)
  })

  test('returns false if styles do not match', () => {
    const a = {
      fontName: 'someFont',
      height: 15,
    }
    const b = {
      fontName: 'someFont',
      height: 5,
    }

    const result = hasEqualStyle(a, b)
    expect(result).toBe(false)
  })

  test('is curried function', () => {
    const a = {
      fontName: 'someFont',
      height: 15,
    }
    const b = {
      fontName: 'someFont',
      height: 5,
    }

    const partial = hasEqualStyle(a)
    expect(partial).toBeInstanceOf(Function)

    const result = partial(b)
    expect(result).toBe(false)
  })
})

describe('addItemToStyle', () => {
  test('adds item to style', () => {
    const items = [
      {
        fontName: 'someFont',
        height: 15,
        text: 'a',
      },
      {
        fontName: 'someFont',
        height: 15,
        text: 'bc',
      },
    ]

    const style = new Style(items[0])

    const partial = addItemToStyle(items[1])
    const result = partial(style)

    expect(result).toBe(style)
    expect(result.items.size).toBe(2)
  })

  test('creates new Style when style is undefined', () => {
    const items = [
      {
        fontName: 'someFont',
        height: 15,
        text: 'a',
      },
      {
        fontName: 'someFont',
        height: 15,
        text: 'bc',
      },
      {
        fontName: 'someFont',
        height: 15,
        text: 'def',
      },
    ]

    const partial = addItemToStyle(items[0])
    const result = partial(undefined)

    expect(result).toBeInstanceOf(Style)
    expect(result.items.size).toBe(1)
  })
})

describe('findAndMutate', () => {
  test('applies result of fn2 to fn1', () => {
    const fn1 = x => y => x.x === y.x
    const fn2 = x => y => {
      y.x += x.x
      return y
    }
    const data = [{ x: 'x' }, { x: 'y' }, { x: 'z' }]

    const partial = findAndMutate(fn1, fn2)
    const result = partial(data, { x: 'x' })

    expect(result).toBeInstanceOf(Array)
    expect(result.length).toBe(3)
    expect(result).toEqual([{ x: 'xx' }, { x: 'y' }, { x: 'z' }])
  })
})

describe('addItemToStyles', () => {
  test('if style match found, add item to style', () => {
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

    const styles = [new Style(item1), new Style(item2)]
    const result = addItemToStyles(styles, item3)

    expect(result).toBeInstanceOf(Array)
    expect(result.length).toBe(2)
    expect(result[1].items.has(item3)).toBe(true)
  })

  test('if no style match, create new style', () => {
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

    const styles = [new Style(item1)]
    const result = addItemToStyles(styles, item2)

    expect(result).toBeInstanceOf(Array)
    expect(result.length).toBe(2)
    expect(result[1].items.size).toBe(1)
    expect(result[1].items.has(item2)).toBe(true)
  })
})

describe('getStyles', () => {
  test('getStyles works', () => {
    const items = singleParPDF.pages[0].map(x => new Item(x))
    const result = getStyles(items)

    expect(result).toBeInstanceOf(Array)
    expect(result.length).toBe(2)

    expect(result[0]).toBeInstanceOf(Style)
    expect(result[0].items.size).toBe(2)
    expect(result[1]).toBeInstanceOf(Style)
    expect(result[1].items.size).toBe(1)
  })
  test('sorts by character count', () => {
    const item1 = {
      fontName: 'someFont',
      height: 15,
      text: 'a',
    }
    const item2 = {
      fontName: 'someFont',
      height: 13,
      text: 'bc',
    }
    const item3 = {
      fontName: 'someFont',
      height: 15,
      text: 'def',
    }

    const result = getStyles([item1, item2, item3])
    expect(result).toBeInstanceOf(Array)
    expect(result.length).toBe(2)

    expect([...result[0].items]).toContain(item1)
    expect([...result[0].items]).toContain(item3)
    expect([...result[1].items]).toContain(item2)
  })
})
