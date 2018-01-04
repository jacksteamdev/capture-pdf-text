/* eslint-env jest */
import fs from 'fs'
import path from 'path'

/* globals PDFJS */
import 'pdfjs-dist'

import applyOptions from '../src/apply-options'
import loadDocument from '../src/load-document'

it('should load the pdf', async () => {
  expect.assertions(3)
  const filepath = path.resolve(
    process.cwd(),
    'test/fixtures/open-org-single-pg.pdf'
  )
  const file = fs.readFileSync(filepath)
  const data = new Uint8Array(file)

  const pdfjs = applyOptions(PDFJS)
  const getPage = await loadDocument(pdfjs, data)

  expect(getPage).toBeInstanceOf(Function)
  expect(getPage.pageCount).toBe(1)
  expect(getPage.data).toBe(data)
})

it('should get the page', async () => {
  expect.assertions(1)
  const filepath = path.resolve(
    process.cwd(),
    'test/fixtures/open-org-single-pg.pdf'
  )
  const file = fs.readFileSync(filepath)
  const data = new Uint8Array(file)

  const pdfjs = applyOptions(PDFJS)
  const getPage = await loadDocument(pdfjs, data)
  const page = await getPage(1)

  expect(page).toBeInstanceOf(Array)
})
