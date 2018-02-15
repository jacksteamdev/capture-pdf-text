import { areNeighbors } from './neighbors'
import { isClose } from './utils'

import isEqual from 'lodash/fp/isEqual'

/**
 * Match items that are same style and close to each other
 */
export const sameStyleNeighbors = [
  {
    height: isEqual,
    fontName: isEqual,
  },
  areNeighbors,
]

/**
 * Match blocks that should be combined:
 *   - close to each other, and
 *   - very close lineHeight and left value
 */
export const sameBlock = [
  areNeighbors,
  {
    left: isClose(1),
    lineHeight: isClose(2),
  },
]
