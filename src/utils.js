import partial from 'lodash/fp/partial'
import isFunction from 'lodash/fp/isFunction'

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
