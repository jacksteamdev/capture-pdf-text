/* eslint-env jest */
import { TextItem } from '../src/classes'

const item = {
  fontName: 'Times',
  str: 'test',
  transform: [
    0, 0, 0, 11, 200, 25
  ],
  width: 8.5
}

it('should have all the right properties', () => {
  const instance = new TextItem(item)

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
