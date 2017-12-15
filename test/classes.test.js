/* eslint-env jest */
import { Item, Block } from '../src/classes'

const item = {
  fontName: 'Times',
  str: 'test',
  transform: [
    0, 0, 0, 11, 200, 25
  ],
  width: 8.5
}

const item2 = {
  fontName: 'Times',
  str: 'test',
  transform: [
    0, 0, 0, 11, 400, 50
  ],
  width: 8.5
}

it('should construct Item', () => {
  const instance = new Item(item)

  expect(instance).toMatchObject({
    fontName: 'Times',
    text: 'test',
    height: 11,
    width: 8.5,
    top: 211,
    right: 33.5,
    bottom: 200,
    left: 25
  })
})
