import { makeBlocks } from './matcher.recursive'
import {
  sameStyleNeighbors,
  sameBlock,
  innerBlock,
} from './matcher.rules'

import flow from 'lodash/fp/flow'
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
  // const getNeighbors = makeBlocks(sameStyleNeighbors())
  // const joinBlocks = makeBlocks(sameBlock(2, 3))
  // const absorbeBlocks = makeBlocks(innerBlock(1))

  const result = flow(
    makeBlocks(sameStyleNeighbors()),
    makeBlocks(sameBlock(2, 3)),
    makeBlocks(innerBlock(1)),
  )

  return result(items)
}
