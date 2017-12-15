/**
 * A TextItem instance maps some properties of an text item from PDFJS
 *
 * @export
 * @class TextItem
 */
export class TextItem {
  constructor (item) {
    const { str, width, fontName } = item
    const [,,, height, bottom, left] = item.transform

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
