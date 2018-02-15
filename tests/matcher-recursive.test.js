//TODO: matcher-rules

recurseIntoBlocks

items = multi paragraph
partial = recurseIntoBlocks(rules)
expect(partial).toBeInstanceOf(Function)
result = partial(items)
expect(result).toBeInstanceOf(Array)
