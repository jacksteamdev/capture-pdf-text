const recurseIntoBlocks = curry((rules, items) => {
  /**
   * makeBlocks ::
   *   (item -> item -> Bool) -> [item] -> [block] -> [block]
   * @param {function} matcher Object matcher with rules applied
   */
  const makeBlocks = rules => {
    // makeBlock :: [item] -> block -> {items, block}
    const makeBlock = makeBlockWith(rules)
    // recurse :: [item] -> [block] -> [block]
    const recurse = ([item, ...items], blocks = []) => {
      if (!item) {
        return blocks
      }

      const results = makeBlock(items, Block.from(item))
      return recurse(results.items, [...blocks, results.block])
    }
    return recurse
  }
  const blocks = recurse(items)

  return blocks
})

/**
 * Recurse through items, making blocks and filter items by matcher
 *
 * makeBlock ::
 *   (item -> item -> Bool) ->
 *   ({ [item], block } -> { [item], block })
 * @param {function} rules Item comparator
 */
const makeBlockWith = rules => {
  const matcher = objectMatcher(rules)

  // Calls itself until all possible items are matched by matcher
  // recurse :: { items, block } -> { items, block }
  const recurse = ({ items, block }) => {
    const filteredItems = items.filter(matcher(block))

    if (filteredItems.length === 0) {
      return { items, block }
    } else {
      const resultBlock = Block.from(block, filteredItems)
      const leftOverItems = without(items, filteredItems)

      return recurse({
        items: leftOverItems,
        block: resultBlock,
      })
    }
  }

  return recurse
}

const items = [{}, {}, {}]

/**
 * Group neighboring items
 * that are all the same style
 * into Blocks
 */
const sameStyleNeighborsBlockMaker = makeBlock(
  areSameStyleNeighbors,
)
const makeSameStyleNeighborsBlocks = makeBlocks(
  sameStyleNeighborsBlockMaker,
)

makeSameStyleNeighborsBlocks(items)
