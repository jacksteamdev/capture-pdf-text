import curry from 'lodash/fp/curry'

import { inRange } from './utils'

/**
 * Get object with padded boundary properties
 *
 * padItem :: a -> {left, right, bottom, top}
 */
export const padItem = (item, amount = 0.7) => {
  const pad = Math.round(item.lineHeight * amount)
  return {
    left: item.left - pad,
    right: item.right + pad,
    bottom: item.bottom - pad,
    top: item.top + pad,
  }
}

/**
 * Is one of the item's key values in range?
 *
 * isCloseBy :: [string] -> a -> a -> Bool
 */
export const isCloseBy = curry(([lo, hi], range, item) => {
  const isInRange = inRange(range[lo], range[hi])
  const result = isInRange(item[lo]) || isInRange(item[hi])
  return result
})

const xIsClose = isCloseBy(['left', 'right'])
const yIsClose = isCloseBy(['bottom', 'top'])

/**
 * Compare two items or blocks to find neighbors.
 *
 * areNeighbors :: a -> a -> Bool
 */
export const areNeighbors = curry((item1, item2) => {
  const search = padItem(item1)
  const result =
    xIsClose(search, item2) && yIsClose(search, item2)
  return result
})
