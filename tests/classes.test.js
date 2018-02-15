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

describe('Block class', () => {
  test('Constructor works', () => {
    const data = singleParPDF.pages[0].map(x => new Item(x))
    const result = new Block(data)

    expect(result).toBeInstanceOf(Block)

    expect(result.items).toBeInstanceOf(Array)
    expect(result.__items).toBeInstanceOf(Array)

    expect(typeof result.text).toBe('string')
    expect(typeof result.left).toBe('number')
    expect(typeof result.right).toBe('number')
    expect(typeof result.bottom).toBe('number')
    expect(typeof result.top).toBe('number')
    expect(typeof result.lineHeight).toBe('number')
  })

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

  test('items is correctly ordered', () => {
    const data = singleParPDF.pages[0].map(x => new Item(x))
    const [item1, item2, item3] = data
    const block = new Block([item3, item1, item2])
    const result = block.items

    expect(result).toEqual(data)
  })

  test('getters return correct values', () => {
    const data = singleParPDF.pages[0].map(x => new Item(x))
    const result = new Block(data)

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

  test('setters do nothing', () => {
    const data = singleParPDF.pages[0].map(x => new Item(x))
    const result = new Block(data)

    result.items = []
    result.text = 'Whatever I want'
    result.top = 900
    result.right = 900
    result.bottom = 900
    result.left = 900
    result.height = 900
    result.lineHeight = 900
    result.width = 900

    expect(result.items.length).not.toBe(0)
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
})
