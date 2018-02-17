import { Block } from '../src/classes'
import { objectMatcher } from '../src/matcher'

import curry from 'lodash/fp/curry'
import without from 'lodash/without'

/**
 * makeBlocks ::
 *   (item -> item -> Bool) -> [item] -> [block] -> [block]
 * @param {function} matcher Object matcher with rules applied
 */
export const makeBlocks = curry((rules, items) => {
  // makeBlock :: [item] -> block -> {items, block}
  const makeBlock = makeBlockWith(rules)
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
export const makeBlockWith = rules => {
  const matcher = objectMatcher(rules)

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
