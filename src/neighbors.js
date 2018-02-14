import curry from 'lodash/fp/curry'

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
 * Compare two items or blocks to find neighbors.
 *
 * areNeighborsBy :: (a -> number) -> a -> a -> Bool
 */
export const areNeighborsBy = curry((fn, item1, item2) => {})

/**
 * areNeighbors :: a -> a -> Bool
 */
export const areNeighbors = areNeighborsBy(itemPadding)
