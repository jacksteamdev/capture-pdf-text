'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var createTrees = _interopDefault(require('kd-interval-tree'));
var _ = _interopDefault(require('lodash/fp'));
var orderBy = _interopDefault(require('lodash/orderBy'));

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

const orderByPosition = items => {
  const iteratees = ['bottom', 'right'];
  const orders = ['desc', 'asc'];
  const ordered = orderBy(items, iteratees, orders);

  return ordered;
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
    const [,,, height, left, bottom] = item.transform;

    this.style = { fontName, height };
    this.text = str;

    this.height = height;
    this.width = width;

    this.top = bottom + height;
    this.right = left + width;
    this.bottom = bottom;
    this.left = left;
  }
}

class Block extends Array {
  static ordered() {
    const items = [...arguments];
    // Need to sort before constructing
    // In the constructor, this.sort would
    // not provide predictable results
    const ordered = orderByPosition(items);
    const block = new Block(...ordered);

    return block;
  }

  getStyles() {
    return this.reduce((r, { style, text }) => {
      const result = [...r].find(_.isEqual(style)) || style;
      // Increase weight by text.length or,
      // if weight is undefined, set weight to text.length
      result.weight = result.weight + text.length || text.length;
      return r.add(result);
    }, new Set())
    // Sort by descending weight
    .sort((a, b) => b.weight - a.weight);
  }

  getRawText() {
    return this.reduce((r, i) => r + i.text, '');
  }

  get text() {
    return this.reduce((r, i, n) => `${r} ${i.text.trim()}`, '').trim();
  }
  set text(t) {
    return undefined;
  }

  // this.top = bottom + height
  get top() {
    return this.reduce((r, { top }) => Math.max(r, top), 0);
  }
  set top(n) {
    return undefined;
  }

  // this.right = left + width
  get right() {
    return this.reduce((r, { right }) => Math.max(r, right), 0);
  }
  set right(n) {
    return undefined;
  }

  // this.bottom = bottom
  get bottom() {
    return this.reduce((r, { bottom }) => Math.min(r, bottom), Infinity);
  }
  set bottom(n) {
    return undefined;
  }

  // this.left = left
  get left() {
    return this.reduce((r, { left }) => Math.min(r, left), Infinity);
  }
  set left(n) {
    return undefined;
  }

  // Add getters for dimensions
  get height() {
    return this.top - this.bottom;
  }
  set height(n) {
    return undefined;
  }

  // this.width = width
  get width() {
    return this.right - this.left;
  }
  set width(n) {
    return undefined;
  }
}

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

const createItemTrees$1 = createTrees(['left', 'right', 'bottom', 'top']);

const byStyle = items => {
  const styleMap = items.reduce((map, item) => {
    const { style } = item;

    const isEqualStyle = _.isEqual(style);

    const keys = [...map.keys()];
    const key = keys.find(isEqualStyle) || style;

    const items = map.get(key) || [];
    return map.set(key, [...items, item]);
  }, new Map());

  return [...styleMap.values()];
};

var groupIntoBlocks = (items => {
  // Items grouped by style
  // Not all seemingly identical styles are the same:
  // The fontName may differ, but the height will be the same
  const itemsByStyle = byStyle(items);

  // Groups of Items mapped to Blocks
  // and sorted by text length
  const blocks = itemsByStyle.map(items => Block.ordered(...items))
  // Sort by Block size
  .sort((a, b) => b.text.length - a.text.length)
  // Group adjacent items
  .map(block => {
    const searchTrees = createItemTrees$1(block);
    const groups = searchTrees.getGroups();
    const blocks = groups.map(g => Block.ordered(...g));

    return blocks;
  }, []);
  // Absorb small blocks into large blocks

  return blocks;
});

const createItemTrees = createTrees(['left', 'right', 'bottom', 'top']);

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
 * @param {Item[]} universe - All Items on page
 * @param {Object} param1 - Object with selection property
 * @param {Number[]} param1.selection - Number pairs representing x and y ranges,
 *                                      with origin in bottom left corner:
 *                                      [left, right, bottom, top]
 */
const groupTextItems = (universe, { selection } = {}) => {
  if (selection) {
    // Universe is all items
    const searchUniverse = createItemTrees(universe);
    const bodyItems = searchUniverse(_.intersection, selection);
    const blocks = groupIntoBlocks(bodyItems);

    return blocks;
  }

  return groupIntoBlocks(universe);
};

exports.configureLoader = configureLoader;
exports.groupTextItems = groupTextItems;
exports.loadDocument = loadDocument;
