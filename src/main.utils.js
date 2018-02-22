import { Block } from './class.block'

import uniq from 'lodash/fp/uniq'

export const validCharBlock = ({ text }) => {
  const chars = uniq([...text])
    .join('')
    .replace(' ', '')
  return (
    chars.length < 2 || !/[A-Za-z0-9àèìòùñÀÈÌÒÙÑ]/.test(chars)
  )
}

export const emptyItem = ({ text }) => !text.trim()

export const isListHead = text =>
  /^[●▪]$/.test(text) ||
  /^(\d{1,2}|[A-Z]|[a-z]|[ivx]{1,3})[.)]?$/.test(text)

export const isListItem = ({ items: [first, second] }) =>
  first &&
  second &&
  first.right < second.left &&
  isListHead(first.text)

export const mapListItem = block => {
  if (isListItem(block)) {
    return Block.from(block, { listItem: block.items[0] })
  } else {
    return block
  }
}
