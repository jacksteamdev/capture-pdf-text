/* eslint-env jest */
import loadPDF from '../src/main'

it('should return a function', () => {
  const array = ['a', 'b', 'c']
  const res = loadPDF(array)
  expect(res).toBeInstanceOf(Function)
})
