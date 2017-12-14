import applyOptions from './apply-options.js'
import loadDocument from './load-document.js'

export default async (PDFJS, data, options) => {
  // Configure PDFJS
  // Disable by passing options as `{doNotApply: true}`
  PDFJS = applyOptions(PDFJS, options)

  // Load PDF document into page loader
  const getPage = loadDocument(PDFJS, data)

  // Return page loader
  return getPage
}
