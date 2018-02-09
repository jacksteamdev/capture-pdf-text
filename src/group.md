const nums = [ 1, 1, 1, 2, 2, 2, 3, 3, 3, ]

splitBy(identity, isEqual, nums)
// [
// [1, 1, 1,],
// [2, 2, 2,],
// [3, 3, 3,],
// ]

const items = [
{ x: 1 },
{ x: 1 },
{ x: 2 },
{ x: 2 },
{ x: 3 },
]

splitBy('x', isEqual, items)
// [
// [ { x: 1 }, { x: 1 } ],
// [ { x: 2 }, { x: 2 } ],
// [ { x: 3 } ],
// ]

```

```

Group Style#items by proximity

* use getStyles
* use kd-interval-tree

Split groups by alignment

* return groups as blocks

Filter bullets:

* low char count Styles with very short blocks

Combine similar styles and group by criteria

* criteria: alignment, internal line spacing?

Combine all styles and sort by position

* use orderByPosition

`getBlocks :: [Items] -> [Blocks]`

```

```
