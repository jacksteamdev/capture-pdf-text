import orderBy from 'lodash/fp/orderBy';
import flatten from 'lodash/fp/flatten';
import trimEnd from 'lodash/fp/trimEnd';
import trimStart from 'lodash/fp/trimStart';
import conforms from 'lodash/fp/conforms';
import isNumber from 'lodash/fp/isNumber';
import isString from 'lodash/fp/isString';
import isObject from 'lodash/fp/isObject';
import flow from 'lodash/fp/flow';
import get from 'lodash/fp/get';
import uniq from 'lodash/fp/uniq';
import curry from 'lodash/fp/curry';
import isFunction from 'lodash/fp/isFunction';
import mapValues from 'lodash/mapValues';
import without from 'lodash/without';
import isEqual from 'lodash/fp/isEqual';
import map from 'lodash/fp/map';
import reject from 'lodash/fp/reject';

/**
 * An Item instance maps some properties of an text item from PDFJS
 *
 * @export
 * @class Item
 */
class Item {
  constructor(item) {
    if (item) {
      const { str, width, fontName } = item;
      const [,,, height, left, bottom] = item.transform;

      this.fontName = fontName;
      this.text = str.replace(/[\u200B\u200E\u200F\u200A]/g, '');

      this.height = this.lineHeight = Math.round(height);
      this.width = Math.round(width);
      this.bottom = Math.round(bottom);
      this.left = Math.round(left);

      this.top = this.bottom + this.height;
      this.right = this.left + this.width;
    }
  }

  static from(item, props) {
    const itemSpec = conforms({
      transform: Array.isArray,
      str: isString,
      width: isNumber,
      fontName: isString
    });
    if (!isObject(props)) {
      props = {};
    }
    if (itemSpec(item)) {
      return Object.assign(new Item(item), props);
    } else {
      return Object.assign(new Item(), item, props);
    }
  }
}

/**
 * A Block instance represents a group of Items
 * @export
 * @class Block
 */
class Block {
  constructor(items, listItem) {
    this.items = Block.order(items);
    this.listItem = listItem;

    this.text = Block.getText(this.items);
    this.lineHeight = Block.frequency('lineHeight', Math.max, items);
    this.fontName = Block.frequency('fontName', Math.max, items);

    this.top = this.items.reduce((r, { top }) => Math.max(r, top), 0);
    this.right = this.items.reduce((r, { right }) => Math.max(r, right), 0);
    this.bottom = this.items.reduce((r, { bottom }) => Math.min(r, bottom), Infinity);
    this.left = this.items.reduce((r, { left }) => Math.min(r, left), Infinity);
    this.height = this.top - this.bottom;
    this.width = this.right - this.left;
  }

  static from() {
    const { items, listItem } = flatten([...arguments]).reduce(({ items, listItem }, item) => {
      switch (item.constructor) {
        case Block:
          if (item.listItem) {
            return {
              items: [...items, ...item.items],
              listItem: item.listItem
            };
          } else {
            return {
              items: [...items, ...item.items],
              listItem
            };
          }

        case Item:
          if (item.listItem) {
            return { items, listItem: item };
          } else {
            return { items: [...items, item], listItem };
          }
        default:
          if (item.listItem && item.listItem.constructor === Item) {
            return { items, listItem: item.listItem };
          } else {
            throw new TypeError(`Block.from: invalid input type (${item.constructor.name})`);
          }
      }
    }, { items: [] });
    // get rid of duplicates
    const set = new Set(items);
    set.delete(listItem);
    return new Block([...set], listItem);
  }

  static getText(items) {
    return items.reduce(({ text, prev }, item) => {
      if (prev && prev.right > item.left) {
        return {
          text: `${trimEnd(text)} ${trimStart(item.text)}`,
          prev: item
        };
      } else {
        return { text: text + item.text, prev: item };
      }
    }, { text: '', prev: null }).text;
  }

  static frequency(key, fn, items) {
    return [...items.reduce((map$$1, item) => {
      const value = item[key];
      const instances = map$$1.get(value) || 0;
      return map$$1.set(value, instances + item.text.length);
    }, new Map())].map(([value, frequency]) => ({ value, frequency })).reduce((r, { value, frequency }) => {
      return fn(r.frequency, frequency) === frequency ? { value, frequency } : r;
    }).value;
  }
  static order(items) {
    const iteratees = ['bottom', 'right'];
    const orders = ['desc', 'asc'];
    const ordered = orderBy(iteratees, orders, items);

    return ordered;
  }
}

const invalidCharBlock = ({ text }) => {
  const chars = uniq([...text]).join('').replace(' ', '');
  return chars.length < 2 || !/[A-Za-z0-9àèìòùñÀÈÌÒÙÑ]/.test(chars);
};

const emptyItem = ({ text }) => !text.trim();

const isListHead = text => /^[●▪]$/.test(text) || /^(\d{1,2}|[A-Z]|[a-z]|[ivx]{1,3})[.)]?$/.test(text);

const isListItem = ({ items: [first, second] }) => first && second && first.right < second.left && isListHead(first.text);

const toListItem = block => {
  if (isListItem(block)) {
    return Block.from(block, { listItem: block.items[0] });
  } else {
    return block;
  }
};

const flattenBlocks = flow(Block.from, get('items'));

/**
 * toPredicate :: a -> (a -> a -> Bool) -> (a -> Bool)
 */
const toPredicate = curry((item, comparator) => isFunction(comparator) ? comparator(item) : conforms(mapValues(comparator, (fn, key) => fn(item[key]))));

/**
 * Compare two objects using a comparator array.
 *
 * matchWith :: [comparator] -> a -> (a -> Bool)
 *
 * @param {array} comparators Array of comparator objects or functions
 * @param {object} item1 First object for comparison
 * @param {object} item2 Second object for comparison
 */
const matchWith = curry((rules, item1, item2) => {
  const predicates = rules.map(toPredicate(item1));
  const result = predicates.every(p => p(item2));
  return result;
});

/**
 * groupBy ::
 *   (item -> item -> Bool) -> [item] -> [block] -> [block]
 * @param {function} matcher Object matcher with rules applied
 */
const groupBy = curry((rules, items) => {
  // makeBlock :: [item] -> block -> {items, block}
  const makeBlock = groupEach(rules);
  // recurse :: [item] -> [block] -> [block]
  const recurse = ([item, ...items], blocks = []) => {
    if (!item) {
      return blocks;
    }
    const results = makeBlock({ items, block: item });
    return recurse(results.items, [...blocks, results.block]);
  };
  return recurse(items);
});

/**
 * Recurse through items, making blocks and filter items by matcher
 *
 * makeBlock ::
 *   (item -> item -> Bool) ->
 *   ({ [item], block } -> { [item], block })
 * @param {function} rules Item comparator
 */
const groupEach = rules => {
  const matcher = matchWith(rules);

  // Calls itself until all possible items are matched by matcher
  // recurse :: { items, block } -> { items, block }
  const recurse = ({ items, block }) => {
    const filteredItems = items.filter(matcher(block));

    if (filteredItems.length === 0) {
      return { items, block: Block.from(block) };
    } else {
      return recurse({
        items: without(items, ...filteredItems),
        block: Block.from(block, ...filteredItems)
      });
    }
  };

  return recurse;
};

const inRange = curry((start, end, num) => {
  const high = Math.max(start, end);
  const low = Math.min(start, end);
  return low <= num && num <= high;
});

const isClose = curry((margin, num1, num2) => {
  return inRange(num1 + margin, num1 - margin, num2);
});

/**
 * Is one of the item's key values in range?
 *
 * isCloseBy :: [string] -> a -> a -> Bool
 */
const isCloseBy = curry(([lo, hi], range, item) => {
  const isInRange = inRange(range[lo], range[hi]);
  const result = isInRange(item[lo]) || isInRange(item[hi]);
  return result;
});

const xIsClose = isCloseBy(['left', 'right']);
const yIsClose = isCloseBy(['bottom', 'top']);

//   // check that block is list item
//   //   - first item matches bullet or numerator
//   //   - second item is not adjoining first
//   // make new block with first item assigned to {listItem: item}

const secondIsNotList = curry((item1, item2) => {
  const second = item2.top < item1.bottom ? item2 : item1;
  return !second.listItem;
});

/**
 * Get object with padded boundary properties
 *
 * padItem :: a -> {left, right, bottom, top}
 */
const padItem = (item, amount = 0.7) => {
  const pad = Math.round(item.lineHeight * amount);
  return {
    left: item.left - pad,
    right: item.right + pad,
    bottom: item.bottom - pad,
    top: item.top + pad
  };
};

/**
 * Compare two items or blocks to find neighbors.
 *
 * areNeighbors :: a -> a -> Bool
 */
const areNeighbors = curry((item1, item2) => {
  const search = padItem(item1);
  const result = xIsClose(search, item2) && yIsClose(search, item2);
  return result;
});

const sameStyle = () => [{ fontName: isEqual, lineHeight: isEqual }];

const sameLine = () => [{
  top: isClose(3),
  bottom: isClose(1)
}];

/**
 * Match items that are same style and close to each other
 */
const sameBlock = (leftMargin = 1, lineMargin = 1) => [{
  left: isClose(leftMargin),
  lineHeight: isClose(lineMargin)
}, areNeighbors, secondIsNotList];

/**
 * parseTextItems :: [item] -> [block]
 */
const parseTextItems = flow(groupBy(sameStyle()), reject(invalidCharBlock), flattenBlocks, groupBy(sameLine()), reject(emptyItem), map(toListItem), groupBy(sameBlock()));

export { parseTextItems, Item, Block };
