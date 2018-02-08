Compare each item in array one to each item in array two. If any items in array one and two evaluate true, the arrays are concatenated. Else, both arrays are returned.

concatIfAny ::
(a -> a -> Bool) -> [a] -> [a] -> [ [a] ] || [ [a], [a] ]

function concatIfAny (fn, array1, array2) {
return array1.some((a) => {
const predicate = fn(a)
return array.2.some((b) => predicate(b))
} ? [ [ ...array1, ...array2 ] ] : [ array1, array2 ]
}

const concatIfAnyEqual = concatIfAny(isEqual)

concatIfAnyEqual(
[1, 2, 3],
[3, 4, 5],
) // [ [1, 2, 3, 3, 4, 5 ] ]

concatIfAnyEqual(
[1, 2, 3],
[4, 5, 6],
) // [ [1, 2, 3], [4, 5, 6] ]

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
