import conforms from 'lodash/fp/conforms'
import curry from 'lodash/fp/curry'
import isFunction from 'lodash/fp/isFunction'

// Only lodash/mapValues includes value and key args
import mapValues from 'lodash/mapValues'

/**
 * toPredicate :: a -> (a -> a -> Bool) -> (a -> Bool)
 */
export const toPredicate = curry(
  (item, comparator) =>
    isFunction(comparator)
      ? comparator(item)
      : conforms(
        mapValues(comparator, (fn, key) => fn(item[key])),
      ),
)
