/* eslint-env jest */

import { Item } from '../src/class.item'

import helloPDF from './fixtures/helloworld.json'

describe('Item class', () => {
  test('Constructor works', () => {
    const data = helloPDF.pages[0][0]
    const result = new Item(data)

    expect(result).toBeInstanceOf(Item)
    expect(result).toHaveProperty('fontName', 'Times')
    expect(result).toHaveProperty('text', 'Hello, world!')
    expect(result).toHaveProperty('height', 12)
    expect(result).toHaveProperty('width', 65)
    expect(result).toHaveProperty('top', 50 + 12)
    expect(result).toHaveProperty('right', 70 + 65)
    expect(result).toHaveProperty('bottom', 50)
    expect(result).toHaveProperty('left', 70)
  })
})

describe('Item.from', () => {
  test('static method from works', () => {
    const item = {
      str: 'Hello, Amy!',
      dir: 'ltr',
      width: 64.656,
      height: 12,
      transform: [12, 0, 0, 12, 70, 50],
      fontName: 'Times',
    }
    const result = Item.from(item)
    expect(result).toBeInstanceOf(Item)
    expect(result.text).toBe('Hello, Amy!')
    expect(result.fontName).toBe('Times')
    expect(result.height).toBe(12)
    expect(result.width).toBe(65)
    expect(result.bottom).toBe(50)
    expect(result.left).toBe(70)
  })
  test('static method from works with generic item', () => {
    const item = {
      text: 'Hello, Amy!',
      width: 100,
      height: 12,
      lineHeight: 12,
      left: 70,
      right: 170,
      bottom: 50,
      top: 62,
      fontName: 'Times',
    }
    const result = Item.from(item)
    expect(result).toBeInstanceOf(Item)
    expect(result.text).toBe('Hello, Amy!')
    expect(result.width).toBe(100)
    expect(result.height).toBe(12)
    expect(result.lineHeight).toBe(12)
    expect(result.left).toBe(70)
    expect(result.right).toBe(170)
    expect(result.bottom).toBe(50)
    expect(result.top).toBe(62)
    expect(result.fontName).toBe('Times')
  })
  test('static method from add listItem property', () => {
    const item = {
      text: 'Hello, Amy!',
      width: 100,
      height: 12,
      lineHeight: 12,
      left: 70,
      right: 170,
      bottom: 50,
      top: 62,
      fontName: 'Times',
    }
    const result = Item.from(item, { listItem: true })
    expect(result).toBeInstanceOf(Item)
    expect(result.text).toBe('Hello, Amy!')
    expect(result.width).toBe(100)
    expect(result.height).toBe(12)
    expect(result.lineHeight).toBe(12)
    expect(result.left).toBe(70)
    expect(result.right).toBe(170)
    expect(result.bottom).toBe(50)
    expect(result.top).toBe(62)
    expect(result.fontName).toBe('Times')
    expect(result.listItem).toBe(true)
  })
})
