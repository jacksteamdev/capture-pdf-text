/* eslint-env jest */
import fs from 'fs'
import path from 'path'

/* globals PDFJS */
import 'pdfjs-dist'

import { loadPdf } from '../src/main'

it('should load the pdf', async () => {
  const filepath = path.resolve(process.cwd(), 'test/fixtures/ifm-simple-page.pdf')
  const file = fs.readFileSync(filepath)
  const data = new Uint8Array(file)

  const getPage = await loadPdf(PDFJS, data)

  expect(getPage).toBeInstanceOf(Function)
  expect(getPage.pageCount).toBe(1)
  expect(getPage.data).toBe(data)
})

it('should load the pdf with options', async () => {
  const filepath = path.resolve(process.cwd(), 'test/fixtures/ifm-simple-page.pdf')
  const file = fs.readFileSync(filepath)
  const data = new Uint8Array(file)
  const options = {
    workerUrl: 'someurl',
    verbosity: 0
  }

  const getPage = await loadPdf(PDFJS, data, options)

  expect(getPage).toBeInstanceOf(Function)
  expect(getPage.pageCount).toBe(1)
  expect(getPage.data).toBe(data)
})
