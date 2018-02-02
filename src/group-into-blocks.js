import _ from 'lodash/fp'

import createTree from './trees'
import { Block } from './classes'
import { getStyles } from './styles'

export default items => {
  const itemsByStyle = getStyles(items).map(({ items }) => [
    ...items,
  ])

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
