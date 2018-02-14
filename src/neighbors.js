import curry from 'lodash/fp/curry'
import inRange from 'lodash/fp/inRange'

/**
 * itemPadding :: a -> number
 */
export const itemPadding = ({ width, lineHeight }) =>
  Math.min(width, lineHeight)

/**
 * Get object with padded boundary properties
 *
 * padItemBy :: (a -> number) -> a -> {left, right, bottom, top}
 */
export const padItem = curry((padFn, item) => {
  const pad = padFn(item)
  return {
    left: item.left - pad,
    right: item.right + pad,
    bottom: item.bottom - pad,
    top: item.top + pad,
  }
})

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

// const xIsClose = isCloseBy(['left', 'right'])
// const yIsClose = isCloseBy(['bottom', 'top'])

/**
 * Compare two items or blocks to find neighbors.
 *
 * areNeighborsBy :: (a -> number) -> a -> a -> Bool
 */
export const areNeighborsBy = curry((fn, item1, item2) => {})

/**
 * areNeighbors :: a -> a -> Bool
 */
export const areNeighbors = areNeighborsBy(itemPadding)
