import compose from 'lodash/fp/compose'
import curry from 'lodash/fp/curry'
import reduce from 'lodash/fp/reduce'
import orderBy from 'lodash/fp/orderBy'

export class Style {
  constructor (item) {
    this.fontName = item.fontName
    this.height = item.height
    this.items = new Set([item])
  }

  addItem (item) {
    if (hasEqualStyle(this, item)) {
      this.items.add(item)
    }
    return this
  }

  getItems () {
    return [...this.items]
  }

  getCharCount () {
    return [...this.items].reduce(
      (r, { text }) => r + text.length,
      0,
    )
  }

  searchTrees () {}
}

/**
 * hasEqualStyle :: Item -> Item -> Boolean
 */
export const hasEqualStyle = curry(
  (item1, item2) =>
    item1.fontName === item2.fontName &&
    item1.height === item2.height,
)

/**
 * addItemToStyle :: Item -> Style -> Style
 */
export const addItemToStyle = item => (
  style = new Style(item),
) => style.addItem(item)

/**
 * findAndMutate :: (a -> a -> Bool) -> (a -> b -> b) ->  a -> [a] -> [a]
 * Needs to fit reduce signature (reducer -> item -> reducer) after functions are applied
 */
export const findAndMutate = curry(
  (comparator, mutator, reducer, item) => {
    const found = reducer.find(comparator(item))
    const changed = mutator(item)(found)

    return Array.from(new Set([...reducer, changed]))
  },
)

/**
 * addItemToStyles :: [Style] -> Item -> [Style]
 * Needs to fit reduce signature
 */
export const addItemToStyles = findAndMutate(
  hasEqualStyle,
  addItemToStyle,
)

/**
 * getStyles :: [Items] -> [Styles]
 */
export const getStyles = compose(
  orderBy(style => style.getCharCount(), 'desc'),
  reduce(addItemToStyles, []),
)
