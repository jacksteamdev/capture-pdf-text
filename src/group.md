Group items in an array into an array of blocks by proximity.

```
groupItems ::  [item] -> [block]

function groupItems (items) {
  const search = createTree(items)
  const groups = getGroupsFromKD(search)
  const blocks = groups.map(Block.from)
  return blocks
}

Block.from = function (items) {
  return new Block(items)
}
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

```
