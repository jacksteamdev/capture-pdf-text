/**
 * getItemPadding :: a -> number
 */
const padding = ({ width, lineHeight }) =>
  Math.min(width, lineHeight)
// specs
getItemPadding(item1) // 1

/**
 * Compare two items or blocks to find neighbors.
 *
 * areNeighborsBy :: (a -> number) -> a -> a -> Bool
 */
const areNeighborsBy = curry((fn, item1, item2) => {})

/**
 * areNeighbors :: a -> a -> Bool
 */
const areNeighbors = areNeighborsBy(getItemPadding)
// specs
areNeighbors(item1, item2) // true
areNeighbors(item1, item3) // false
