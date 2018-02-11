import {
  kdIntervalTree,
  getGroupsFromKD,
} from 'kd-interval-tree'

/**
 * createTree :: [Item] -> {([Keys] -> [Items]), [Block]}
 */
export const createTree = kdIntervalTree([
  ['left', 'right'],
  ['bottom', 'top'],
])

export const getGroups = getGroupsFromKD
