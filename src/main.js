import { groupBy } from './matcher'
import { Block } from './class.block'
import { sameStyle, sameLine, sameBlock } from './rules'
import {
  validCharBlock,
  emptyItem,
  mapListItem,
} from './main.utils'

import flow from 'lodash/fp/flow'
import reject from 'lodash/fp/reject'
import get from 'lodash/fp/get'
import map from 'lodash/fp/map'

/**
 * parseTextItems :: [item] -> [block]
 */
export const parseTextItems = flow(
  groupBy(sameStyle()),
  reject(validCharBlock),
  Block.from,
  get('items'),
  groupBy(sameLine()),
  reject(emptyItem),
  map(mapListItem),
  groupBy(sameBlock()),
)
