import { Block } from './classes'
import { orderByPosition } from './order-items'

export default items => {
  const ordered = orderByPosition(items)
  const block = new Block(...ordered)
  return [block]
}
