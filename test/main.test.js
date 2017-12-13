/* eslint-env jest */
import fs from 'fs'
import path from 'path'

import loadPdf from '../src/main'

it('should load the pdf', async () => {
  const filepath = path.resolve(process.cwd(), 'test/fixtures/ifm-simple-page.pdf')
  const file = fs.readFileSync(filepath)
  const data = new Uint8Array(file)

  const pdf = await loadPdf(data)
  expect(pdf.size).toBe(1)

  const page = await pdf(1)
  expect(typeof page).toBe('string')
})
