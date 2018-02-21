/* eslint-env jest */

import { Item } from '../src/classes'
import { parseTextItems } from '../src/main'

import lipsumGoogle from './fixtures/lipsum-google.json'
import lipsumLibre from './fixtures/lipsum-libre.json'
import ifm57 from './fixtures/ifm-57.json'
import ifm41 from './fixtures/ifm-41.json'

describe('parseTextItems', () => {
  test('parse lipsum libre', () => {
    const items = lipsumLibre.pages[0].map(Item.from)
    const result = parseTextItems(items)
    expect(result).toBeInstanceOf(Array)
    expect(result.length).toBe(4)
  })
  test('parse lipsum google', () => {
    const items = lipsumGoogle.pages[0].map(
      item => new Item(item),
    )
    const result = parseTextItems(items)
    expect(result).toBeInstanceOf(Array)
    expect(result.length).toBe(20)
  })
  test('parse IFM 57 sample: numbering', () => {
    const items = ifm57.pages[0].map(item => new Item(item))
    const result = parseTextItems(items)
    expect(result).toBeInstanceOf(Array)
    expect(result.length).toBe(19)
  })
  test('parse IFM 41 sample: bullets', () => {
    const items = ifm41.pages[0].map(item => new Item(item))
    const result = parseTextItems(items)
    expect(result).toBeInstanceOf(Array)
    expect(result.length).toBe(16)
  })
})
