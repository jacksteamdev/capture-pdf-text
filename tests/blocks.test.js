/* eslint-env jest */

import { createBlocks, blocksAreNear } from '../src/blocks'
import { Block, Item } from '../src/classes'
import singleParPDF from './fixtures/single-paragraph.json'

describe('createBlocks', () => {
  test('creates an array of blocks', () => {
    const data = singleParPDF.pages[0].map(x => new Item(x))
    const result = createBlocks([data, data])

    expect(result).toBeInstanceOf(Array)
    expect(result.length).toBe(2)
    expect(result[0]).toBeInstanceOf(Block)
    expect(result[1]).toBeInstanceOf(Block)
  })
})

describe('blocksAreNear', () => {
  test('if blocks are near returns TRUE', () => {
    const result = blocksAreNear(
      { top: 5, bottom: 1, lineHeight: 1 },
      { top: 10, bottom: 6, lineHeight: 1 },
    )
    expect(result).toBe(true)
  })
  test('if blocks are near returns FALSE', () => {
    const result = blocksAreNear(
      { top: 5, bottom: 1, lineHeight: 1 },
      { top: 10, bottom: 7, lineHeight: 1 },
    )
    expect(result).toBe(false)
  })
})
