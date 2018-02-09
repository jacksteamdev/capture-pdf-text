import fp from 'lodash/fp';
import kdIntervalTree from 'kd-interval-tree';
import orderBy from 'lodash/fp/orderBy';

/**
 * createTree :: [Item] -> {([Keys] -> [Items]), [Block]}
 */
const createTree = kdIntervalTree(['left', 'right', 'bottom', 'top']);

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
 * @func    orderByPageAndPosition
 * @desc    Sort items by pageNumber and position on page.
 * @param   {array}     items        - An array of objects with pageNum, top, and left values
 * @prop    {number}    item.pageNum - Integer representing the PDF origin page of the item
 * @prop    {number}    item.top     - Number indicating the highest y-coordinate in the item
 * @prop    {number}    item.left    - Number indicating the lowest x-coordinate of the item
 *
 * @returns {array} - An array of items sorted page by page, top to bottom, left to right.
 */

/**
 * An Item instance maps some properties of an text item from PDFJS
 *
 * @export
 * @class Item
 */
class Item {
  constructor(item) {
    const { str, width, fontName } = item;
    const [,,, height, left, bottom] = item.transform;

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

/**
 * A Block instance represents a group of Items
 * @export
 * @class Block
 */

const loadDocument = pdf => {
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

        return {
          height: page.pageInfo.view[3],
          width: page.pageInfo.view[2],
          items: items.map(item => new Item(item))
        };
      } else {
        throw new Error(`Page ${n} of ${count} out of range.`);
      }
    } catch (error) {
      throw error;
    }
  };

  getPage.pageCount = count;

  return getPage;
};

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
const loadDocumentWithPDFJS = async (PDFJS, data) => {
  const pdf = await PDFJS.getDocument(data);
  return loadDocument(pdf);
};

/**
 * Load a PDF for text extraction.
 * @param {PDFJS} PDFJS - PDFJS from pdfjs-dist, which pollutes the global scope when imported
 * @param {string|Uint8Array} data - PDF url or Uint8Array containing the PDF data
 * @param {[Object]} options - Options to configure PDFJS:
 * @param {string} options.workerUrl - URL for pdf.worker.min.js. CORS restrictions apply.
 * @param {number} options.verbosity - Supress PDFJS console messages: 0 for Errors, 1 for Warnings, 5 for Info.
 * @returns {Promise} - Returns a Promise with a Function as the result.
 */
const configureLoader = (PDFJS, options) => {
  // Configure PDFJS
  // Disable by passing options as `{doNotApply: true}`
  const pdfjs = applyOptions(PDFJS, options);

  return async data => {
    // Load PDF document into page loader
    // Returns getPage Function with closured pdf
    const getPage = await loadDocumentWithPDFJS(pdfjs, data);

    // Return page loader
    return getPage;
  };
};

/**
 * Returns groups of text items by selection ranges
 * @param {Item[]} allItems - All Items on page
 * @param {Object} param1 - Object with selection property
 * @param {Number[]} param1.selection - Number pairs representing x and y ranges,
 *                                      with origin in bottom left corner:
 *                                      [left, right, bottom, top]
 */
const groupTextItems = (allItems, { selection } = {}) => {
  if (selection) {
    const { searchTrees } = createTree(allItems);
    const blocks = searchTrees(searchForBlocks, selection);

    return blocks;
  }

  return groupIntoBlocks(allItems);
};

export { configureLoader, groupTextItems, loadDocument };
