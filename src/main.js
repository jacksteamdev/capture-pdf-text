import createTrees from 'kd-interval-tree'
import _ from 'lodash/fp'

import applyOptions from './apply-options'
import loadDocument from './load-document'

const createItemTrees = createTrees(['left', 'right', 'bottom', 'top'])

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
    const getPage = await loadDocument(pdfjs, data)

    // Return page loader
    return getPage
  }
}

export const groupTextItems = (universe, { selection }) => {
  // Universe is all items
  const searchUniverse = createItemTrees(universe)
  const bodyItems = searchUniverse(_.intersection, selection)

  return bodyItems
}
