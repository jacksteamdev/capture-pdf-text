/* eslint-env jest */

import { Block } from '../src/class.block'
import { Item } from '../src/class.item'

import singleParPDF from './fixtures/single-paragraph.json'

describe('Block class', () => {
  test('Constructor works', () => {
    const data = singleParPDF.pages[0].map(x => new Item(x))
    const result = new Block(data)

    expect(result).toBeInstanceOf(Block)

    expect(result.items).toBeInstanceOf(Array)

    expect(typeof result.text).toBe('string')
    expect(typeof result.left).toBe('number')
    expect(typeof result.right).toBe('number')
    expect(typeof result.bottom).toBe('number')
    expect(typeof result.top).toBe('number')
    expect(typeof result.lineHeight).toBe('number')

    expect(result.text).toBe(
      'Puro, Chile, es tu cielo azulado. Puras brisas te cruzan también. Y tu campo de flores bordado, es la copia feliz del Edén. Majestuosa es la blanca montaña, que te dio por baluarte el Señor. Y ese mar que tranquilo te baña, te promete futuro esplendor.',
    )
    expect(result.top).toBe(736)
    expect(result.right).toBe(552)
    expect(result.bottom).toBe(696)
    expect(result.left).toBe(57)
    expect(result.height).toBe(40)
    expect(result.lineHeight).toBe(12)
    expect(result.width).toBe(495)
  })

  test('items are correctly ordered', () => {
    const data = singleParPDF.pages[0].map(x => new Item(x))
    const [item1, item2, item3] = data
    const block = new Block([item3, item1, item2])
    const result = block.items
    expect(result).toEqual(data)
  })
})

describe('Block.from', () => {
  test('works', () => {
    const item1 = new Item({
      str: 'Hello, Amy!',
      dir: 'ltr',
      width: 64.656,
      height: 12,
      transform: [12, 0, 0, 12, 70, 50],
      fontName: 'Times',
    })
    const item2 = new Item({
      str: 'Hello, Jack!',
      dir: 'ltr',
      width: 64.656,
      height: 12,
      transform: [12, 0, 0, 12, 70, 50],
      fontName: 'Times',
    })
    const result = Block.from(item1, item2)
    expect(result).toBeInstanceOf(Block)
    expect(result.items.length).toBe(2)
  })
  test('works with listItem Item', () => {
    const item1 = Item.from(
      {
        str: 'Hello, Amy!',
        dir: 'ltr',
        width: 64.656,
        height: 12,
        transform: [12, 0, 0, 12, 70, 50],
        fontName: 'Times',
      },
      { listItem: true },
    )
    const item2 = new Item({
      str: 'Hello, Jack!',
      dir: 'ltr',
      width: 64.656,
      height: 12,
      transform: [12, 0, 0, 12, 70, 50],
      fontName: 'Times',
    })
    const result = Block.from(item1, item2)
    expect(result).toBeInstanceOf(Block)
    expect(result.items.length).toBe(1)
    expect(result.listItem).toBe(item1)
  })
  test('works with listItem Block', () => {
    const item1 = Item.from(
      {
        str: 'Hello, Amy!',
        dir: 'ltr',
        width: 64.656,
        height: 12,
        transform: [12, 0, 0, 12, 70, 50],
        fontName: 'Times',
      },
      { listItem: true },
    )
    const item2 = new Item({
      str: 'Hello, Jack!',
      dir: 'ltr',
      width: 64.656,
      height: 12,
      transform: [12, 0, 0, 12, 70, 50],
      fontName: 'Times',
    })
    const item3 = new Item({
      str: 'Hello, Kitty!',
      dir: 'ltr',
      width: 64.656,
      height: 12,
      transform: [12, 0, 0, 12, 70, 50],
      fontName: 'Times',
    })
    const block = Block.from(item1, item2)
    const result = Block.from(item3, block)
    expect(result).toBeInstanceOf(Block)
    expect(result.items.length).toBe(2)
    expect(result.listItem).toBe(item1)
  })
  test('works with manual listItem', () => {
    const item1 = Item.from({
      str: 'Hello, Amy!',
      dir: 'ltr',
      width: 64.656,
      height: 12,
      transform: [12, 0, 0, 12, 70, 50],
      fontName: 'Times',
    })
    const item2 = Item.from({
      str: 'Hello, Jack!',
      dir: 'ltr',
      width: 64.656,
      height: 12,
      transform: [12, 0, 0, 12, 70, 50],
      fontName: 'Times',
    })
    const item3 = Item.from({
      str: 'Hello, Kitty!',
      dir: 'ltr',
      width: 64.656,
      height: 12,
      transform: [12, 0, 0, 12, 70, 50],
      fontName: 'Times',
    })
    const result = Block.from(item1, item2, { listItem: item3 })
    expect(result).toBeInstanceOf(Block)
    expect(result.items.length).toBe(2)
    expect(result.listItem).toBe(item3)
  })
  test('works with manual listItem 2', () => {
    const item1 = Item.from({
      str: 'Hello, Amy!',
      dir: 'ltr',
      width: 64.656,
      height: 12,
      transform: [12, 0, 0, 12, 70, 50],
      fontName: 'Times',
    })
    const item2 = Item.from({
      str: 'Hello, Jack!',
      dir: 'ltr',
      width: 64.656,
      height: 12,
      transform: [12, 0, 0, 12, 70, 50],
      fontName: 'Times',
    })
    const item3 = Item.from({
      str: 'Hello, Kitty!',
      dir: 'ltr',
      width: 64.656,
      height: 12,
      transform: [12, 0, 0, 12, 70, 50],
      fontName: 'Times',
    })
    const block = Block.from(item1, item2, item3)
    const result = Block.from(block, { listItem: item3 })
    expect(result).toBeInstanceOf(Block)
    expect(result.items.length).toBe(2)
    expect(result.listItem).toBe(item3)
  })
  test('throws TypeError with invalid input', () => {
    const item1 = Item.from({
      str: 'Hello, Amy!',
      dir: 'ltr',
      width: 64.656,
      height: 12,
      transform: [12, 0, 0, 12, 70, 50],
      fontName: 'Times',
    })
    const item2 = Item.from({
      str: 'Hello, Jack!',
      dir: 'ltr',
      width: 64.656,
      height: 12,
      transform: [12, 0, 0, 12, 70, 50],
      fontName: 'Times',
    })
    const item3 = {}
    expect(() => Block.from(item1, item2, item3)).toThrow(
      TypeError,
    )
  })

  test('removes duplicates', () => {
    const item1 = new Item({
      str: 'Hello, Amy!',
      dir: 'ltr',
      width: 64.656,
      height: 12,
      transform: [12, 0, 0, 12, 70, 50],
      fontName: 'Times',
    })
    const item2 = new Item({
      str: 'Hello, Jack!',
      dir: 'ltr',
      width: 64.656,
      height: 12,
      transform: [12, 0, 0, 12, 70, 50],
      fontName: 'Times',
    })
    const block = Block.from(item1, item2)
    const result = Block.from(item1, item2, block)
    expect(result).toBeInstanceOf(Block)
    expect(result.items.length).toBe(2)
  })
  test('works with array of items', () => {
    const item1 = new Item({
      str: 'Hello, Amy!',
      dir: 'ltr',
      width: 64.656,
      height: 12,
      transform: [12, 0, 0, 12, 70, 50],
      fontName: 'Times',
    })
    const item2 = new Item({
      str: 'Hello, Jack!',
      dir: 'ltr',
      width: 64.656,
      height: 12,
      transform: [12, 0, 0, 12, 70, 50],
      fontName: 'Times',
    })
    const block = Block.from(item1, item2)
    const result = Block.from([item1, item2, block])
    expect(result).toBeInstanceOf(Block)
    expect(result.items.length).toBe(2)
  })
})

describe('Block.getText', () => {
  test('joins lines correctly', () => {
    const data = singleParPDF.pages[0].map(x => new Item(x))
    const result = Block.getText(data)
    expect(result).toBe(
      'Puro, Chile, es tu cielo azulado. Puras brisas te cruzan también. Y tu campo de flores bordado, es la copia feliz del Edén. Majestuosa es la blanca montaña, que te dio por baluarte el Señor. Y ese mar que tranquilo te baña, te promete futuro esplendor.',
    )
  })
})

describe('Block.frequency', () => {
  test('gets most frequent value', () => {
    const items = [
      { x: 12, text: 'some text' },
      { x: 12, text: 'some text' },
      { x: 12, text: 'some text' },
      { x: 12, text: 'some text' },
      { x: 14, text: 'some bigger text' },
      { x: 14, text: 'some bigger text' },
    ]
    const result = Block.frequency('x', Math.max, items)
    expect(result).toBe(12)
  })
})

describe('Block.order', () => {
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

    const result = Block.order([item2, item1, item3])

    expect(result).toBeInstanceOf(Array)
    expect(result.length).toBe(3)
    expect(result).toEqual([item1, item2, item3])
  })
})
