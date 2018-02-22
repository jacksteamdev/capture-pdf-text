/**
 * @func    orderByPageAndPosition
 * @desc    Sort items by pageNumber and position on page.
 * @param   {array}     items        - An array of objects with pageNum, top, and left values
 * @prop    {number}    item.pageNum - Integer representing the PDF origin page of the item
 * @prop    {number}    item.top     - Number indicating the highest y-coordinate in the item
 * @prop    {number}    item.left    - Number indicating the lowest x-coordinate of the item
 *
 * @returns {array} - An array of items sorted page by page, top to bottom, left to right.
 */

import orderBy from 'lodash/fp/orderBy'

export const orderByPosition = items => {
  const iteratees = ['bottom', 'right']
  const orders = ['desc', 'asc']
  const ordered = orderBy(iteratees, orders, items)

  return ordered
}
