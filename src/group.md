```
Predicate one block upon another by proximity and alignment
```

blocksAreRelated :: block -> block -> Bool

const blocksAreRelated = overEvery([blocksAreNear, blocksAreAligned('left', 1)])

blocksAreRelated(
{ top: 5, bottom: 1, lineHeight: 1, left: 1 },
{ top: 10, bottom: 6, lineHeight: 1, left: 1 },
) // true

blocksAreRelated(
{ top: 5, bottom: 1, lineHeight: 1, left: 1 },
{ top: 10, bottom: 7, lineHeight: 1, left: 1 },
) // false

blocksAreRelated(
{ top: 5, bottom: 1, lineHeight: 1, left: 1.5 },
{ top: 10, bottom: 6, lineHeight: 1, left: 1 },
) // true

blocksAreRelated(
{ top: 5, bottom: 1, lineHeight: 1, left: 2 },
{ top: 10, bottom: 6, lineHeight: 1, left: 1 },
) // false

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
