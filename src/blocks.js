import _ from 'lodash/fp'
import compose from 'lodash/fp/compose'
import map from 'lodash/fp/map'
import inRange from 'lodash/fp/inRange'
import curry from 'lodash/fp/curry'

import createTree from './trees'
import { Block } from './classes'
import { getStyles } from './styles'
import { orderByPosition, orderTTB } from './order-items'

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
 * blocksAreAligned :: string -> number -> block -> block -> Bool
 */
export const blocksAreAligned = curry((key, rangeSize, a, b) => {
  const range = toRangeBy(rangeSize, a[key])
  return inRange(...range, b[key])
})
