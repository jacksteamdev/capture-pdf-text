/* eslint-env jest */

import {
  matchWith,
  toPredicate,
  groupBy,
  groupEach,
} from '../src/matcher'

import { Block } from '../src/class.block'
import { Item } from '../src/class.item'
import { sameBlock, sameLine } from '../src/rules'

import singleParagraph from './fixtures/single-paragraph.json'
import multiParagraph from './fixtures/multi-paragraph.json'

import flow from 'lodash/fp/flow'
import isEqual from 'lodash/fp/isEqual'

describe('toPredicate', () => {
  test('partially applies comparator', () => {
    const item1 = { x: 1 }
    const item2 = { x: 2 }
    const item3 = { x: 1 }
    const item4 = { x: 1, y: 5 }
    const predicate = toPredicate(item1, isEqual)
    expect(predicate(item2)).toBe(false)
    expect(predicate(item3)).toBe(true)
    expect(predicate(item4)).toBe(false)
  })
  test('partially applies comparator object', () => {
    const item1 = { x: 1, y: 9 }
    const item2 = { x: 2, y: 10 }
    const item3 = { x: 1, y: 11 }
    const comparator = { x: isEqual }
    const predicate = toPredicate(item1, comparator)
    expect(predicate(item2)).toBe(false)
    expect(predicate(item3)).toBe(true)
  })
})

describe('matchWith', () => {
  test('matches by comparator object', () => {
    const item1 = { height: 12, fontName: 'Times' }
    const item2 = { height: 13, fontName: 'Times' }
    const item3 = { height: 12, fontName: 'Times' }
    const item4 = { height: 12, fontName: 'Arial' }
    const partial = matchWith([
      {
        height: isEqual,
        fontName: isEqual,
      },
    ])
    expect(partial).toBeInstanceOf(Function)
    expect(partial(item1, item3)).toBe(true)
    expect(partial(item1, item2)).toBe(false)
    expect(partial(item1, item4)).toBe(false)
  })
  // test('filters items by block', () => {})
})

describe('groupBy', () => {
  test('it returns an array of blocks', () => {
    const [item1] = singleParagraph.pages[0].map(
      item => new Item(item),
    )
    const partial = groupBy(sameBlock())
    expect(partial).toBeInstanceOf(Function)
    const result = partial([item1])
    expect(result).toBeInstanceOf(Array)
    expect(result.length).toBe(1)
    expect(result[0]).toBeInstanceOf(Block)
    expect(result[0].items.length).toBe(1)
    expect(result[0].items[0]).toBe(item1)
  })
  test('makes five paragraphs', () => {
    const items = multiParagraph.pages[0].map(
      item => new Item(item),
    )
    // fs.writeFileSync(
    //   './tests/fixtures/multi-paragraph-items.json',
    //   JSON.stringify(items, null, 2),
    // )
    const partial = flow(
      groupBy(sameLine()),
      groupBy(sameBlock()),
    )
    const result = partial(items)
    expect(result.length).toBe(5)
  })
})

describe('groupEach', () => {
  test('it groups correctly', () => {
    const [item1, item2, item3] = singleParagraph.pages[0].map(
      item => new Item(item),
    )
    const partial = groupEach(sameBlock())
    expect(partial).toBeInstanceOf(Function)
    const result = partial({
      items: [item1, item3],
      block: item2,
    })
    expect(result).toHaveProperty('items')
    expect(result).toHaveProperty('block')
    const { items, block } = result
    expect(block.items.length).toBe(3)
    expect(items.length).toBe(0)
    expect(block.items).toContain(item2)
    expect(block.items).toContain(item3)
    expect(block.items).toContain(item1)
  })
  test('it climbs the ladder', () => {
    const item1 = new Item({
      str: 'item1',
      dir: 'ltr',
      width: 50,
      height: 12,
      transform: [12, 0, 0, 12, 0, 0],
      fontName: 'Helvetica',
    })
    const item2 = new Item({
      str: 'item2',
      dir: 'ltr',
      width: 50,
      height: 12,
      transform: [12, 0, 0, 12, 50, 0],
      fontName: 'Helvetica',
    })
    const item3 = new Item({
      str: 'item3',
      dir: 'ltr',
      width: 50,
      height: 12,
      transform: [12, 0, 0, 12, 100, 0],
      fontName: 'Helvetica',
    })

    const partial = groupEach(sameLine())
    const result = partial({
      items: [item2, item3],
      block: item1,
    }).block
    expect(result).toBeInstanceOf(Block)
    expect(result.items).toContain(item1)
    expect(result.items).toContain(item2)
    expect(result.items).toContain(item3)
  })
  test('it groups multi paragraph', () => {
    const [item, ...items] = multiParagraph.pages[0].map(
      item => new Item(item),
    )
    // fs.writeFileSync(
    //   './tests/fixtures/multi-paragraph-items.json',
    //   JSON.stringify(items, null, 2),
    // )
    const partial = groupEach(sameBlock())
    const result = partial({ items, block: item }).block
    expect(result).toBeInstanceOf(Block)

    expect(
      result.items.filter(
        ({ text }) => text === 'uras brisas te cruzan también',
      ),
    ).toBeDefined()
  })
})
