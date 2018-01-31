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
    expect(result).toHaveProperty('style')
    expect(result.style).toHaveProperty('height', 12)
    expect(result.style).toHaveProperty('fontName', 'Times')
    expect(result).toHaveProperty('text', 'Hello, world!')
    expect(result).toHaveProperty('height', 12)
    expect(result).toHaveProperty('width', 64.656)
    expect(result).toHaveProperty('top', 50 + 12)
    expect(result).toHaveProperty('right', 70 + 64.656)
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
    expect(result.getStyles).toBeInstanceOf(Function)
    expect(result.getRawText).toBeInstanceOf(Function)

    expect(typeof result.text).toBe('string')
    expect(typeof result.left).toBe('number')
    expect(typeof result.right).toBe('number')
    expect(typeof result.bottom).toBe('number')
    expect(typeof result.top).toBe('number')
  })

  test('getStyles works', () => {
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
    expect(result.right).toBe(551.7400000000006)
    expect(result.bottom).toBe(696.4)
    expect(result.left).toBe(56.8)
    expect(result.height).toBe(39.60000000000002)
    expect(result.width).toBe(494.94000000000057)
  })
})
