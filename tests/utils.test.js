/* eslint-env jest */
import { secondIsNotList } from '../src/utils'
import { Item } from '../src/classes'

describe('secondIsNotList', () => {
  test('returns true if item2 is not a listItem', () => {
    const item1 = Item.from(
      {
        fontName: 'Helvetica',
        text: 'Puro, Chile, es tu cielo azulado',
        lineHeight: 12,
        height: 12,
        width: 165,
        bottom: 709,
        left: 54,
        top: 721,
        right: 219,
      },
      { listItem: true },
    )
    const item2 = Item.from(
      {
        fontName: 'Helvetica',
        text: 'uras brisas te cruzan también',
        lineHeight: 12,
        height: 12,
        width: 157,
        bottom: 709,
        left: 233,
        top: 721,
        right: 390,
      },
      { listItem: false },
    )

    const partial = secondIsNotList(item1)
    const result = partial(item2)
    expect(result).toBe(true)
  })

  test('returns false if item2 is a listItem', () => {
    const item1 = Item.from(
      {
        fontName: 'Helvetica',
        text: 'Puro, Chile, es tu cielo azulado',
        lineHeight: 12,
        height: 12,
        width: 165,
        bottom: 709,
        left: 54,
        top: 721,
        right: 219,
      },
      { listItem: true },
    )
    const item2 = Item.from(
      {
        fontName: 'Helvetica',
        text: 'uras brisas te cruzan también',
        lineHeight: 12,
        height: 12,
        width: 157,
        bottom: 709,
        left: 233,
        top: 721,
        right: 390,
      },
      { listItem: true },
    )
    const result = secondIsNotList(item1, item2)
    expect(result).toBe(false)
  })
})
