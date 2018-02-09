import _ from 'lodash/fp'
import compose from 'lodash/fp/compose'
import map from 'lodash/fp/map'
import inRange from 'lodash/fp/inRange'
import curry from 'lodash/fp/curry'
import overEvery from 'lodash/fp/overEvery'
import sortBy from 'lodash/fp/sortBy'

import createTree from './trees'
import { Block } from './classes'
import { getStyles } from './styles'
import { orderByPosition, orderTTB } from './order-items'

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
      const predicate = fn(current[0] || x)

      if (predicate(x)) {
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
 * toRangeBy :: number -> number -> [number]
 */
export const toRangeBy = curry((amt, num) => {
  return [num - amt / 2, num + amt / 2]
})

/**
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
 * Compare each item in array one to each item in array two. If any items in array one and two evaluate true, the arrays are concatenated. Else, both arrays are returned.
 *
 * concatIfAny ::
 *   (a -> a -> Bool) -> [a] -> [a] -> [ [a] ]  ||  [ [a], [a] ]
 */
export const concatIfAny = curry((fn, array1, array2) => {
  return array1.some(a => {
    const predicate = fn(a)
    return array2.some(b => predicate(b))
  })
    ? [[...array1, ...array2]]
    : [array1, array2]
})
