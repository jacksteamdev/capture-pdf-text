(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.capturePDF = factory());
}(this, (function () { 'use strict';

/**
 * Configure PDFJS
 * @param {PDFJS} PDFJS
 * @param {Object} options
 * @param {string} options.workerUrl - URL for pdf.worker.min.js, may be in `public/` or a CDN
 * @param {number} options.verbosity - Supress console messages: Errors only, 0; Warnings, 1; Info, 5;
 */
const applyOptions = (PDFJS, options = { verbosity: 0 }) => {
  if (!options.doNotApply) {
    // Setup worker
    const version = PDFJS.version;
    const workerUrl = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`;
    PDFJS.workerSrc = options.workerUrl || workerUrl;

    // Suppress console.log messages
    // 0 : Errors (default)
    // 1 : Warnings
    // 5 : Infos
    PDFJS.verbosity = options.verbosity;
  }

  return PDFJS;
};

const loadDocument = async (PDFJS, data) => {
  const pdf = await PDFJS.getDocument(data);
  const count = pdf.pdfInfo.numPages;

  const getPage = async n => {
    const page = await pdf.getPage(n);
    const { items } = await page.getTextContent();

    return items;
  };

  getPage.pageCount = count;
  getPage.data = data;

  return getPage;
};

var main = (async (PDFJS, data, options) => {
  // Configure PDFJS
  // Disable by passing options as `{doNotApply: true}`
  PDFJS = applyOptions(PDFJS, options);

  // Load PDF document into page loader
  const getPage = loadDocument(PDFJS, data);

  // Return page loader
  return getPage;
});

return main;

})));
