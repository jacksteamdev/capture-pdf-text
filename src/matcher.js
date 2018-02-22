import { Block } from '../src/class.block'

import conforms from 'lodash/fp/conforms'
import curry from 'lodash/fp/curry'
import isFunction from 'lodash/fp/isFunction'

import mapValues from 'lodash/mapValues'
import without from 'lodash/without'

/**
 * toPredicate :: a -> (a -> a -> Bool) -> (a -> Bool)
 */
export const toPredicate = curry(
  (item, comparator) =>
    isFunction(comparator)
      ? comparator(item)
      : conforms(
        mapValues(comparator, (fn, key) => fn(item[key])),
      ),
)

/**
 * Compare two objects using a comparator array.
 *
 * matchWith :: [comparator] -> a -> (a -> Bool)
 *
 * @param {array} comparators Array of comparator objects or functions
 * @param {object} item1 First object for comparison
 * @param {object} item2 Second object for comparison
 */
export const matchWith = curry((rules, item1, item2) => {
  const predicates = rules.map(toPredicate(item1))
  const result = predicates.every(p => p(item2))
  return result
})

/**
 * groupBy ::
 *   (item -> item -> Bool) -> [item] -> [block] -> [block]
 * @param {function} matcher Object matcher with rules applied
 */
export const groupBy = curry((rules, items) => {
  // makeBlock :: [item] -> block -> {items, block}
  const makeBlock = groupEach(rules)
  // recurse :: [item] -> [block] -> [block]
  const recurse = ([item, ...items], blocks = []) => {
    if (!item) {
      return blocks
    }
    const results = makeBlock({ items, block: item })
    return recurse(results.items, [...blocks, results.block])
  }
  return recurse(items)
})

/**
 * Recurse through items, making blocks and filter items by matcher
 *
 * makeBlock ::
 *   (item -> item -> Bool) ->
 *   ({ [item], block } -> { [item], block })
 * @param {function} rules Item comparator
 */
export const groupEach = rules => {
  const matcher = matchWith(rules)

  // Calls itself until all possible items are matched by matcher
  // recurse :: { items, block } -> { items, block }
  const recurse = ({ items, block }) => {
    const filteredItems = items.filter(matcher(block))

    if (filteredItems.length === 0) {
      return { items, block: Block.from(block) }
    } else {
      return recurse({
        items: without(items, ...filteredItems),
        block: Block.from(block, ...filteredItems),
      })
    }
  }

  return recurse
}
