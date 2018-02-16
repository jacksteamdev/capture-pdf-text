import { areNeighbors } from './neighbors'
import { isClose, isLTE, isGTE } from './utils'

import isEqual from 'lodash/fp/isEqual'

/**
 * Match items that are same style and close to each other
 */
export const sameStyleNeighbors = () => [
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
export const sameBlock = (leftMargin, lineMargin) => [
  areNeighbors,
  {
    left: isClose(leftMargin),
    lineHeight: isClose(lineMargin),
  },
]

/**
 * Match blocks that
 * are inside the first block
 */
export const innerBlock = margin => [
  {
    left: isLTE(margin),
    right: isGTE(margin),
    bottom: isLTE(margin),
    top: isGTE(margin),
  },
]
