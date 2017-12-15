import { TextItem } from './classes'

/**
 * Loads PDF into PDFJS and returns a function to get the items from individual pages
 *
 * @export
 * @async
 * @function loadDocument
 * @param {PDFJS} PDFJS - Pre-configured PDFJS from 'pdfjs-dist'
 * @param {string|Uint8Array} data - PDF URL or PDF as TypedArray (Uint8Array)
 * @returns {Function} - getPage(pageNumber)
 */
const loadDocument = async (PDFJS, data) => {
  const pdf = await PDFJS.getDocument(data)
  const count = pdf.pdfInfo.numPages

  /**
   * Get page text items from pdf
   *
   * @async
   * @function getPage
   * @param {number} n - Page number
   * @return {Promise<Items[]>}
   */
  const getPage = async (n) => {
    try {
      if (n <= count) {
        const page = await pdf.getPage(n)
        const {items} = await page.getTextContent()

        return items.map((item) => new TextItem(item))
      } else {
        throw new Error(`Page ${n} of ${count} out of range.`)
      }
    } catch (error) {
      throw error
    }
  }

  getPage.pageCount = count
  getPage.data = data

  return getPage
}

export default loadDocument
