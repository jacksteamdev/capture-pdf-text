import { groupBy } from './matcher'
import { sameStyle, sameLine, sameBlock } from './rules'
import {
  flattenBlocks,
  invalidCharBlock,
  emptyItem,
  toListItem,
} from './main.utils'

import flow from 'lodash/fp/flow'
import map from 'lodash/fp/map'
import reject from 'lodash/fp/reject'

/**
 * parseTextItems :: [item] -> [block]
 */
export const parseTextItems = flow(
  groupBy(sameStyle()),
  reject(invalidCharBlock),
  flattenBlocks,
  groupBy(sameLine()),
  reject(emptyItem),
  map(toListItem),
  groupBy(sameBlock()),
)
