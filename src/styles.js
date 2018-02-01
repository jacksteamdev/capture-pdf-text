import compose from 'lodash/fp/compose'
import curry from 'lodash/fp/curry'
import reduce from 'lodash/fp/reduce'
import sortBy from 'lodash/fp/sortBy'
import uniq from 'lodash/fp/uniq'

import { Style } from './classes'

/**
 * hasEqualStyle :: Item -> Item -> Boolean
 */
export const hasEqualStyle = curry(
  (item1, item2) =>
    item1.fontName === item2.fontName &&
    item1.height === item2.height,
)

/**
 * findStyleBy :: [Style] -> fn -> Item -> [Style]
 */
export const findStyleBy = curry((finder, styles, item) => {
  const style = styles.find(finder(item)) || new Style(item)
  // Increase weight by text.length or,
  // if weight is undefined, set weight to text.length
  style.weight += item.text.length

  return uniq([...styles, style])
})

// /**
//  * getSortedBy :: a -> fn -> string -> [Item] -> [b]
//  */
// export const reduceBy = curry((accumulator, fn, items) => [
//   ...items.reduce(fn, accumulator),
// ])

/**
 * getStyles :: [Items] -> [Styles]
 */
export const getStyles = compose(
  sortBy('height'),
  reduce([]),
  findStyleBy(hasEqualStyle),
)
