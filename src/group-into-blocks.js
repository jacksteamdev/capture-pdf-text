import kdIntervalTree from 'kd-interval-tree'
import _ from 'lodash/fp'

import { Block } from './classes'
// import { orderByPosition, orderTTB } from './order-items'

const createTree = kdIntervalTree(['left', 'right', 'bottom', 'top'])

const byStyle = items => {
  const styleMap = items.reduce((map, item) => {
    const { style } = item

    const isEqualStyle = _.isEqual(style)

    const keys = [...map.keys()]
    const key = keys.find(isEqualStyle) || style

    const items = map.get(key) || []
    return map.set(key, [...items, item])
  }, new Map())

  return [...styleMap.values()]
}

export default items => {
  // Items grouped by style
  // Not all seemingly identical styles are the same:
  // The fontName may differ, but the height will be the same
  const itemsByStyle = byStyle(items)

  // Groups of Items mapped to Blocks
  // and sorted by text length
  const blocks = itemsByStyle
    .map(items => Block.ordered(...items))
    // Sort by Block size
    .sort((a, b) => b.text.length - a.text.length)
    // Group adjacent items
    .map(block => {
      const { groups } = createTree(block)
      const blocks = groups.map(g => Block.ordered(...g))

      return blocks
    }, [])

  return _.flatten(blocks)
}
