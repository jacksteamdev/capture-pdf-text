/**
 * A Item instance maps some properties of an text item from PDFJS
 *
 * @export
 * @class Item
 */
export class Item {
  constructor (item) {
    const { str, width, fontName } = item
    const [, , , height, left, bottom] = item.transform

    this.fontName = fontName
    this.text = str

    this.height = height
    this.width = width

    this.top = bottom + height
    this.right = left + width
    this.bottom = bottom
    this.left = left
  }
}

export class Block extends Array {
  get text () {
    return this.reduce((r, s) => r + s.text, '')
  }
}
