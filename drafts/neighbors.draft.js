/**
 * itemPadding :: a -> number
 */
const itemPadding = ({ width, lineHeight }) =>
  Math.min(width, lineHeight)
// specs
itemPadding(item1) // 1

/**
 * Get object with padded boundary properties
 *
 * padItemBy :: (a -> number) -> a -> {left, right, bottom, top}
 */
const padItem = (padFn, item) => {
  const pad = padFn(item)
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
const isCloseBy = ([lo, hi], range, item) => {
  const isInRange = inRange(range[lo], range[hi])
  const result = isInRange(item[lo]) || isInRange(item[hi])
  return result
}
const xIsClose = isCloseBy(['left', 'right'])
const yIsClose = isCloseBy(['bottom', 'top'])

/**
 * Compare two items or blocks to find neighbors.
 *
 * areNeighborsBy :: (a -> number) -> a -> a -> Bool
 */
const areNeighborsBy = curry((fn, item1, item2) => {
  const search = padItem(fn, item1)

  const result =
    xIsClose(search, item2) && yIsClose(search, item2)

  return result
})

/**
 * areNeighbors :: a -> a -> Bool
 */
const areNeighbors = areNeighborsBy(itemPadding)
// specs
areNeighbors(item1, item2) // true
areNeighbors(item1, item3) // false
