/* eslint-env jest */

import { Item, Block } from '../src/classes'

// import mockPDFJS from 'pdfjs-mock'

import helloPDF from './fixtures/helloworld.json'
import singleParPDF from './fixtures/single-paragraph.json'

test('Item constructor works', () => {
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

test.only('Block constructor works', () => {
  const data = singleParPDF.pages[0].map(x => new Item(x))
  const result = new Block(data[0])
  expect(result).toBeInstanceOf(Block)
})
