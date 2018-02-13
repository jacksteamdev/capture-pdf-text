import _ from 'lodash/fp'
import map from 'lodash/fp/map'
import inRange from 'lodash/fp/inRange'
import curry from 'lodash/fp/curry'
import overEvery from 'lodash/fp/overEvery'
import sortBy from 'lodash/fp/sortBy'
import reject from 'lodash/fp/reject'
import isEqual from 'lodash/fp/isEqual'
import flow from 'lodash/fp/flow'

import { createTree, getGroups } from './trees'
import { Block } from './classes'
import { orderByPosition, orderTTB } from './order-items'
import { trace, recurse } from './utils'

/**
 * isEmpty :: item -> Bool
 */
export const isEmpty = item => !item.text.trim()

/**
 * Split an array into nested arrays by value. Use a partially applied predicate to start a new array or add the element to the current one.
 *
 * splitBy ::
 *  string -> (a -> a -> Bool) -> [a] -> [ [a] ]
 */
export const splitBy = curry((key, fn, items) => {
  const sorted = sortBy(key, items)
  const split = sorted.reduce(
    (r, x) => {
      const current = r.slice(-1)[0]
      const prev = r.slice(0, -1)
      const value1 = current[0] || x
      const predicate = fn(key ? value1[key] : value1)

      if (predicate(key ? x[key] : x)) {
        return [...prev, [...current, x]]
      } else {
        return [...r, [x]]
      }
    },
    [[]],
  )
  return split
})

/**
 * TODO: Replace in favor of map(Block.from, [[Item]])
 * createBlocks :: [[Item]] -> [Block]
 * @param {Item[][]} itemArrays Array of arrays of items
 */
export const createBlocks = itemArrays =>
  Array.from(itemArrays, g => new Block(g))

/**
 * close to each other vertically
 * blocksAreNear :: block -> block -> Bool
 */
export const blocksAreNear = curry((block1, block2) => {
  const [a, b] = orderTTB([block1, block2])
  const space = Math.abs(a.bottom - b.top)
  return space <= a.lineHeight || space <= b.lineHeight
})

/**
 * TODO: rename to makeRange
 * toRangeBy :: number -> number -> [number]
 */
export const toRangeBy = curry((amt, num) => {
  return [num - amt / 2, num + amt / 2]
})

/**
 * TODO: rename to inRangeBy
 * TODO: partially apply to make blocksAreAligned
 * Predicate one block upon another by property value.
 *
 * blocksAreAligned :: string -> number -> block -> block -> Bool
 * @function blocksAreAligned
 * @param {number} rangeSize change this number to make alignment more or less inclusive
 */
export const blocksAreAligned = curry((key, rangeSize, a, b) => {
  const range = toRangeBy(rangeSize, a[key])
  return inRange(...range, b[key])
})

/**
 * Predicate one block upon another by proximity and alignment
 *
 * blocksAreRelated :: block -> block -> Bool
 */
export const blocksAreRelated = overEvery([
  blocksAreNear,
  blocksAreAligned('left', 1),
])

/**
 * Compare all elements of two arrays by predicate
 *
 * predicateSome ::
 *   (a -> a -> Bool) -> [a] -> [a] -> Bool
 */
export const predicateSome = curry((fn, array1, array2) => {
  return array1.some(a => {
    const predicate = fn(a)
    return array2.some(b => predicate(b))
  })
})

/**
 * TODO: Rename recursiveConcatBy
 * Recursively combine all possible arrays by predicate
 *
 * concatBy :: ([a] -> [a] -> Bool) -> [[a]] -> [[a]]
 */
export const concatBy = curry((fn, array1, array2) => {})

/**
 * TODO: Remove in favor of recursiveConcatBy
 * Recursively combine similar arrays
 *
 * combineSimilar ::
 * @param {Array[]} groups   Array of arrays of Blocks
 */
export const concatAllBy = groups => {
  const joinIfRelated = predicateSome(blocksAreRelated)

  const processed = recurse(
    ({ joined, groups }) => {
      const [first, second, ...rest] = groups
      if (second) {
        const done = joinIfRelated(first, second)
        return done.length === 1
          ? { joined: [...joined, ...done], groups: rest }
          : {
            joined: [...joined, first],
            groups: [second, ...rest],
          }
      } else {
        return {
          joined: [...joined, first],
          groups: [],
        }
      }
    },
    ({ groups }) => groups.length === 0,
    {
      joined: [],
      groups: [...groups],
    },
  )

  return processed
}

/**
 * TODO: rename to groupIntoBlocksByTree
 * Group items in an array into an array of blocks by proximity.
 *
 * groupItems ::  [item] -> [block]
 */
export const groupItems = items => {
  const search = createTree(items)
  const groups = getGroups(search)
  const blocks = groups.map(Block.from)
  return blocks
}

/**
 * TODO
 * Group items into blocks similar to paragraphs
 *
 * groupIntoBlocks :: [items] -> [blocks]
 */

export const groupIntoBlocks = items => {
  const itemsWithText = reject(isEmpty)

  const splitByHeight = splitBy('height', isEqual)
  const itemsByHeight = splitByHeight(itemsWithText)

  const splitByFont = splitBy('fontName', isEqual)
  const itemsByHeightAndFont = itemsByHeight.map(items => {
    const blocksByStyle = splitByFont(items).map(itemsByFont => {
      return itemsByFont.map(groupItems)
    })

    return joinSimilar(blocksByStyle).map(blocks => {
      const items = blocks.reduce(
        (r, { items }) => [...r, ...items],
        [],
      )
      return groupItems(items)
    })
  })

  // Here goes orderbyPosition

  const itemsByHeightAndSimilar = itemsByHeightAndFont.map(
    joinSimilar,
  )

  return itemsByHeightAndSimilar
}
