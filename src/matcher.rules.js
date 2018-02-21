import { areNeighbors } from './neighbors'
import { isClose, secondIsNotList } from './utils'

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
export const sameBlock = (leftMargin = 1, lineMargin = 1) => [
  {
    left: isClose(leftMargin),
    lineHeight: isClose(lineMargin),
  },
  areNeighbors,
  secondIsNotList,
]
