import conforms from 'lodash/fp/conforms'
import curry from 'lodash/fp/curry'
import isFunction from 'lodash/fp/isFunction'

// Only lodash/mapValues includes value and key args
import mapValues from 'lodash/mapValues'
// import overEvery from 'lodash/overEvery'

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

/**
 * Compare two objects using a comparator array.
 *
 * objectMatcher :: [comparator] -> a -> (a -> Bool)
 *
 * @param {array} comparators Array of comparator objects or functions
 * @param {object} item1 First object for comparison
 * @param {object} item2 Second object for comparison
 */
export const objectMatcher = curry(
  (comparators, item1, item2) => {
    const predicates = comparators.map(toPredicate(item1))
    const result = predicates.every(p => p(item2))
    return result
  },
)
