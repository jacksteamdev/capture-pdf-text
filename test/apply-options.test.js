/* eslint-env jest */
/* globals PDFJS */
import 'pdfjs-dist'

import applyOptions from '../src/apply-options.js'

it('should apply default options', () => {
  const result = applyOptions(PDFJS)

  const version = PDFJS.version
  const workerUrl = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`

  expect(result.workerSrc).toBe(workerUrl)
  expect(result.verbosity).toBe(0)
})

it('should not apply options', () => {
  const { workerSrc, verbosity } = PDFJS

  const result = applyOptions(PDFJS, {doNotApply: true})

  expect(result.workerSrc).toBe(workerSrc)
  expect(result.verbosity).toBe(verbosity)
})

it('should apply options from object', () => {
  const options = {
    workerUrl: 'someurl',
    verbosity: 5
  }

  const result = applyOptions(PDFJS, options)

  expect(result.workerSrc).toBe(options.workerUrl)
  expect(result.verbosity).toBe(options.verbosity)
})
