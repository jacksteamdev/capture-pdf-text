import { areNeighbors } from './neighbors'
import { isClose, isLTE, isGTE } from './utils'

import isEqual from 'lodash/fp/isEqual'

export const sameStyle = () => [
  { fontName: isEqual, lineHeight: isEqual },
]

export const sameLine = () => [
  {
    top: isClose(3),
    bottom: isClose(1),
  },
]

/**
 * Match items that are same style and close to each other
 */
export const sameStyleNeighbors = () => [
  {
    lineHeight: isEqual,
    listItem: secondIsNotList,
  },
  areNeighbors,
]

/**
 * Match blocks that should be combined:
 *   - close to each other, and
 *   - very close lineHeight
 *   - and are left aligned
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
