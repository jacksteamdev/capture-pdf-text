/* global PDFJS */
import 'pdfjs-dist' // Use with workers
// import 'pdfjs-dist/build/pdf.combined.js' // Use without workers

const workerUrl = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.203/pdf.worker.min.js'

export default async (data, worker = workerUrl) => {
  PDFJS.workerSrc = worker
  PDFJS.verbosity = 0

  const pdf = await PDFJS.getDocument(data)
  const size = pdf.pdfInfo.numPages
  const getPage = async (n) => {
    const page = await pdf.getPage(n)
    const {items} = await page.getTextContent()

    return items
      .reduce((r, {str}) => r + str, '')
      .slice(0, 250) + '...'
  }

  getPage.size = size
  return getPage
}
