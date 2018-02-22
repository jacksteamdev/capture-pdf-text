import { makeBlocks } from './matcher.recursive'
import { Block } from './class.block'
import { sameStyle, sameLine, sameBlock } from './matcher.rules'

import flow from 'lodash/fp/flow'
import reject from 'lodash/fp/reject'
import get from 'lodash/fp/get'
import uniq from 'lodash/fp/uniq'
import map from 'lodash/fp/map'

/**
 * parseTextItems :: [item] -> [block]
 */
export const parseTextItems = items => {
  const validCharBlock = ({ text }) => {
    const chars = uniq([...text])
      .join('')
      .replace(' ', '')
    return (
      chars.length < 2 || !/[A-Za-z0-9àèìòùñÀÈÌÒÙÑ]/.test(chars)
    )
  }

  const emptyItem = ({ text }) => !text.trim()
  const isListItem = ({ items: [first, second] }) =>
    first &&
    second &&
    first.right < second.left &&
    (/^(\d{1,2}|[A-Z]|[a-z]|[ivx]{1,3})[.)]?$/.test(
      first.text,
    ) ||
      /^[●▪]$/.test(first.text))

  const mapListItem = block => {
    if (isListItem(block)) {
      return Block.from(block, { listItem: block.items[0] })
    } else {
      return block
    }
  }

  //   // check that block is list item
  //   //   - first item matches bullet or numerator
  //   //   - second item is not adjoining first
  //   // make new block with first item assigned to {listItem: item}

  const result = flow(
    makeBlocks(sameStyle()),
    reject(validCharBlock),
    Block.from,
    get('items'),
    makeBlocks(sameLine()),
    reject(emptyItem),
    map(mapListItem),
    makeBlocks(sameBlock()),
  )

  return result(items)
}
