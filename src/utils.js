import curry from 'lodash/fp/curry'

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
