import createTrees from 'kd-interval-tree'
import _ from 'lodash/fp'

import { Block } from './classes'
import { orderByPosition, orderTTB } from './order-items'

const createItemTrees = createTrees(['left', 'right', 'bottom', 'top'])

const byStyle = items => {
  const styleMap = items.reduce((map, item) => {
    const { height, fontName } = item
    const style = { height, fontName }

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
    .map(items => {
      const ordered = orderByPosition(items)
      const block = new Block(...ordered)

      return block
    })
    .sort((a, b) => b.text.length - a.text.length)
    .reduce((r, styleBlock) => {
      const trees = createItemTrees(...styleBlock)
      // Group adjacent items
      return [...r, styleBlock]
    }, [])
  // Absorb small blocks of into large blocks

  return blocks
}
