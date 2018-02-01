import _ from 'lodash/fp'

import createTree from './trees'
import { Block } from './classes'
import { getStyles } from './styles'

const groupBy = fn => items => {
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
  const itemsByStyle = groupByStyle(items)

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
