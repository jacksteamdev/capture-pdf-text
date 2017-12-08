/* eslint-env jest */
import loadPDF from '../src/main'

it('should return a function', () => {
  const array = ['a', 'b', 'c']
  const res = loadPDF(array)
  expect(res).toBeInstanceOf(Promise)
})

it('should async return n + 1 in the array', async () => {
  const array = ['a', 'b', 'c']
  const api = await loadPDF(array)

  const a = await api(1)
  const b = await api(2)

  expect(a).toBe('a')
  expect(b).toBe('b')
})
