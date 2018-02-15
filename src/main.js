import _ from 'lodash/fp'

import createTree from './trees'
import applyOptions from './apply-options'
import { loadDocumentWithPDFJS } from './load-document'

export { loadDocument } from './load-document'

/**
 * Load a PDF for text extraction.
 * @param {PDFJS} PDFJS - PDFJS from pdfjs-dist, which pollutes the global scope when imported
 * @param {string|Uint8Array} data - PDF url or Uint8Array containing the PDF data
 * @param {[Object]} options - Options to configure PDFJS:
 * @param {string} options.workerUrl - URL for pdf.worker.min.js. CORS restrictions apply.
 * @param {number} options.verbosity - Supress PDFJS console messages: 0 for Errors, 1 for Warnings, 5 for Info.
 * @returns {Promise} - Returns a Promise with a Function as the result.
 */
export const configureLoader = (PDFJS, options) => {
  // Configure PDFJS
  // Disable by passing options as `{doNotApply: true}`
  const pdfjs = applyOptions(PDFJS, options)

  return async data => {
    // Load PDF document into page loader
    // Returns getPage Function with closured pdf
    const getPage = await loadDocumentWithPDFJS(pdfjs, data)

    // Return page loader
    return getPage
  }
}

/**
 * Returns groups of text items by selection ranges
 * @param {Item[]} allItems - All Items on page
 * @param {Object} param1 - Object with selection property
 * @param {Number[]} param1.selection - Number pairs representing x and y ranges,
 *                                      with origin in bottom left corner:
 *                                      [left, right, bottom, top]
 */
export const groupTextItems = (allItems, { selection } = {}) => {
  if (selection) {
    const { searchTrees } = createTree(allItems)
    const blocks = searchTrees(searchForBlocks, selection)

    return blocks
  }

  return groupIntoBlocks(allItems)
}
