/* eslint-env jest */
import fs from 'fs'
import path from 'path'

/* globals PDFJS */
import 'pdfjs-dist'

import { loadPdf, groupTextItems } from '../src/main'

it('should load the pdf', async () => {
  expect.assertions(3)
  const filepath = path.resolve(
    process.cwd(),
    'test/fixtures/ifm-simple-page.pdf'
  )
  const file = fs.readFileSync(filepath)
  const data = new Uint8Array(file)

  const getPage = await loadPdf(PDFJS, data)

  expect(getPage).toBeInstanceOf(Function)
  expect(getPage.pageCount).toBe(1)
  expect(getPage.data).toBe(data)
})

it.only('should return the selected items', async () => {
  expect.assertions(2)
  const filepath = path.resolve(
    process.cwd(),
    'test/fixtures/ifm-simple-page.pdf'
  )
  const file = fs.readFileSync(filepath)
  const data = new Uint8Array(file)
  const selection = [200, 545, 170, 730]

  const getPage = await loadPdf(PDFJS, data)
  const pageItems = await getPage(1)

  const result = groupTextItems(pageItems, { selection })

  expect(result).toBeInstanceOf(Array)
  expect(result).not.toContain(
    expect.objectContaining({
      text: 'New Testament Survey'
    })
  )
})
