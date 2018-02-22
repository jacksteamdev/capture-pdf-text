import curry from 'lodash/fp/curry'

const inRange = curry((start, end, num) => {
  const high = Math.max(start, end)
  const low = Math.min(start, end)
  return low <= num && num <= high
})

export const isClose = curry((margin, num1, num2) => {
  return inRange(num1 + margin, num1 - margin, num2)
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

export const xIsClose = isCloseBy(['left', 'right'])
export const yIsClose = isCloseBy(['bottom', 'top'])

//   // check that block is list item
//   //   - first item matches bullet or numerator
//   //   - second item is not adjoining first
//   // make new block with first item assigned to {listItem: item}

export const secondIsNotList = curry((item1, item2) => {
  const second = item2.top < item1.bottom ? item2 : item1
  return !second.listItem
})

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
