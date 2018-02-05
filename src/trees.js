import kdIntervalTree from 'kd-interval-tree'

/**
 * createTree :: [Item] -> {([Keys] -> [Items]), [Block]}
 */
const createTree = kdIntervalTree([
  'left',
  'right',
  'bottom',
  'top',
])

export default createTree
