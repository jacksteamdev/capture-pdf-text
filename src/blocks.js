import _ from 'lodash/fp'
import compose from 'lodash/fp/compose'
import map from 'lodash/fp/map'

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

// close to each other vertically
export const blocksAreNear = (block1, block2) => {
  const [a, b] = orderTTB([block1, block2])
  const space = Math.abs(a.bottom - b.top)
  return space <= a.lineHeight || space <= b.lineHeight
}
