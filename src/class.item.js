import conforms from 'lodash/fp/conforms'
import isNumber from 'lodash/fp/isNumber'
import isString from 'lodash/fp/isString'
import isObject from 'lodash/fp/isObject'

/**
 * An Item instance maps some properties of an text item from PDFJS
 *
 * @export
 * @class Item
 */
export function Item (item) {
  if (item) {
    const { str, width, fontName } = item
    const [, , , height, left, bottom] = item.transform

    this.fontName = fontName
    this.text = str.replace(/[\u200B\u200E\u200F\u200A]/g, '')

    this.height = this.lineHeight = Math.round(height)
    this.width = Math.round(width)
    this.bottom = Math.round(bottom)
    this.left = Math.round(left)

    this.top = this.bottom + this.height
    this.right = this.left + this.width
  }
}

Item.from = function (item, props) {
  const itemSpec = conforms({
    transform: Array.isArray,
    str: isString,
    width: isNumber,
    fontName: isString,
  })
  if (!isObject(props)) {
    props = {}
  }
  if (itemSpec(item)) {
    return Object.assign(new Item(item), props)
  } else {
    return Object.assign(new Item(), item, props)
  }
}
