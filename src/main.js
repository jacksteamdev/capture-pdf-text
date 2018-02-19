import { makeBlocks } from './matcher.recursive'
import { Block } from './classes'
import {
  sameLine,
  sameStyleNeighbors,
  sameBlock,
  innerBlock,
} from './matcher.rules'

import flow from 'lodash/fp/flow'
import reject from 'lodash/fp/reject'
import get from 'lodash/fp/get'
export { loadDocument } from './load-document'

/**
 * Returns groups of text items by selection ranges
 * groupTextItems :: [item] -> {selection: [[number]]} -> (() -> [item])
 * @param {Item[]} allItems - All Items on page
 * @param {Object} param1 - Object with selection property
 * @param {Number[]} param1.selection - Number pairs representing x and y ranges,
 *                                      with origin in bottom left corner:
 *                                      [left, right, bottom, top]
 */
export const parseTextItems = items => {
  const emptyItem = ({ text }) => !text.trim()

  const result = flow(
    makeBlocks(sameLine()),
    reject(emptyItem),
    Block.from,
    get('items'),
    makeBlocks(sameStyleNeighbors()),
    makeBlocks(sameBlock(2, 3)),
    makeBlocks(innerBlock(1)),
    reject(emptyItem),
  )

  return result(items)
}
