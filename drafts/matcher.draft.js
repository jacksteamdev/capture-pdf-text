/**
 * toPredicate :: a -> (a -> a -> Bool) -> (a -> Bool)
 */
const toPredicate = item => comparator =>
  isFunction(comparator)
    ? comparator(item)
    : conforms(mapValues(fn => fn(item), comparator))

/**
 * Compare two objects using a comparator array.
 *
 * objectMatcher :: [comparator] -> a -> (a -> Bool)
 *
 * @param {array} comparators Array of comparator objects or functions
 * @param {object} item1 First object for comparison
 * @param {object} item2 Second object for comparison
 */
const objectMatcher = curry((comparators, item1, item2) => {
  const predicates = comparators.map(toPredicate(item1))

  return overEvery(predicates, item2)
})

// tests
const areSameStyle = objectMatcher([
  {
    height: isEqual,
    fontName: isEqual,
  },
])
areSameStyle(item1, item2) // true
areSameStyle(item1, item3) // false

const areSameStyleNeighbors = objectMatcher([
  {
    height: isEqual,
    fontName: isEqual,
  },
  areNeighbors,
])
areSameStyleNeighbors(item1, item2) // true
areSameStyleNeighbors(item1, item3) // false
