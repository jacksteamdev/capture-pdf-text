/* eslint-env jest */

import { Item, Block } from '../src/classes'

// import mockPDFJS from 'pdfjs-mock'

import helloPDF from './fixtures/helloworld.json'
import singleParPDF from './fixtures/single-paragraph.json'

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
  test('static method from works', () => {
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
  test.only('works with manual listItem', () => {
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

  test('static method from removes duplicates', () => {
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
})
