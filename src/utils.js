import curry from 'lodash/fp/curry'
import partial from 'lodash/fp/partial'
import isFunction from 'lodash/fp/isFunction'

export const checkPropsBy = curry((keys, label, item) => {
  const missing = keys
    .filter(key => item[key] === undefined)
    .join(', ')
  if (missing) {
    throw new Error(`${label} does not contain ${missing}`)
  }
})

export const inRange = curry((start, end, num) => {
  const high = Math.max(start, end)
  const low = Math.min(start, end)
  return low <= num && num <= high
})

export const isClose = curry((margin, num1, num2) => {
  return inRange(num1 + margin, num1 - margin, num2)
})

export const trace = label => x => {
  console.log(label, x)
  return x
}

export const recurse = (func, predicate, initialVal) => {
  let bounce = f => {
    while (isFunction(f)) {
      f = f.apply(f.context, f.args)
    }
    return f
  }
  let cursor = (v, nv) => {
    if (predicate(v)) {
      return v
    } else {
      return partial(cursor, nv, func(nv))
    }
  }
  return bounce(partial(cursor, initialVal, func(initialVal)))
}
