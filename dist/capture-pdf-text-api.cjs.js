'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * Configure PDFJS
 *
 * @export
 * @function applyOptions
 * @param {PDFJS} PDFJS
 * @param {Object} options
 * @param {Boolean} options.doNotApply - `true` to skip config for PDFJS, use if PDFJS is already configured
 * @param {string} options.workerUrl - URL for pdf.worker.min.js, may be in `public/` or a CDN
 * @param {number} options.verbosity - Supress console messages: Errors only, 0; Warnings, 1; Info, 5;
 */
const applyOptions = (PDFJS, options = {}) => {
  if (!options.doNotApply) {
    // Setup worker
    const version = PDFJS.version;
    const workerUrl = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`;
    PDFJS.workerSrc = options.workerUrl || workerUrl;

    // Suppress console messages
    // 0 : Errors (default)
    // 1 : Warnings
    // 5 : Infos
    PDFJS.verbosity = options.verbosity || 0;
  }

  return PDFJS;
};

/**
 * A Item instance maps some properties of an text item from PDFJS
 *
 * @export
 * @class Item
 */
class Item {
  constructor(item) {
    const { str, width, fontName } = item;
    const [,,, height, bottom, left] = item.transform;

    this.fontName = fontName;
    this.text = str;

    this.height = height;
    this.width = width;

    this.top = bottom + height;
    this.right = left + width;
    this.bottom = bottom;
    this.left = left;
  }
}

class Block extends Array {}

const loadDocument = async (PDFJS, data) => {
  const pdf = await PDFJS.getDocument(data);
  const count = pdf.pdfInfo.numPages;

  /**
   * Get page text items from pdf
   *
   * @async
   * @function getPage
   * @param {number} n - Page number
   * @return {Promise<Items[]>}
   */
  const getPage = async n => {
    try {
      if (n <= count) {
        const page = await pdf.getPage(n);
        const { items } = await page.getTextContent();

        return items.map(item => new Item(item));
      } else {
        throw new Error(`Page ${n} of ${count} out of range.`);
      }
    } catch (error) {
      throw error;
    }
  };

  getPage.pageCount = count;
  getPage.data = data;

  return getPage;
};

/**
 * Group items by section and margin
 *
 * @param {Item[]} items
 * @param {Object} options
 * @param {Object} options.sections - Section name: RangeArray
 * @param {RangeArray} options.sections.header
 * @param {RangeArray} options.sections.body
 * @param {RangeArray} options.sections.sidebarL
 * @param {RangeArray} options.sections.sidebarR
 * @param {RangeArray} options.sections.footer
 *
 * @returns {Block[]}
 */
const groupItems = (items, options) => {
  // Reduce to sections by range
  // Create section trees
  // Group within sections
  const blocks = [new Block(...items)];
  return blocks;
};

const loadPdf = async (PDFJS, data, options) => {
  // Configure PDFJS
  // Disable by passing options as `{doNotApply: true}`
  const pdfjs = applyOptions(PDFJS, options);

  // Load PDF document into page loader
  // Returns getPage Function with closured pdf
  const getPage = await loadDocument(pdfjs, data);

  // Return page loader
  return getPage;
};

const groupTextItems = (textItems, options) => {
  const groups = groupItems(textItems, options);
  return groups;
};

exports.loadPdf = loadPdf;
exports.groupTextItems = groupTextItems;
