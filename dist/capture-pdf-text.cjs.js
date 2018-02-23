'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var orderBy = _interopDefault(require('lodash/fp/orderBy'));
var flatten = _interopDefault(require('lodash/fp/flatten'));
var trimEnd = _interopDefault(require('lodash/fp/trimEnd'));
var trimStart = _interopDefault(require('lodash/fp/trimStart'));
var conforms = _interopDefault(require('lodash/fp/conforms'));
var isNumber = _interopDefault(require('lodash/fp/isNumber'));
var isString = _interopDefault(require('lodash/fp/isString'));
var isObject = _interopDefault(require('lodash/fp/isObject'));
var flow = _interopDefault(require('lodash/fp/flow'));
var get = _interopDefault(require('lodash/fp/get'));
var uniq = _interopDefault(require('lodash/fp/uniq'));
var curry = _interopDefault(require('lodash/fp/curry'));
var isFunction = _interopDefault(require('lodash/fp/isFunction'));
var mapValues = _interopDefault(require('lodash/mapValues'));
var without = _interopDefault(require('lodash/without'));
var isEqual = _interopDefault(require('lodash/fp/isEqual'));
var map = _interopDefault(require('lodash/fp/map'));
var reject = _interopDefault(require('lodash/fp/reject'));

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject$$1) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject$$1,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();



































var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();











var toArray = function (arr) {
  return Array.isArray(arr) ? arr : Array.from(arr);
};

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

/**
 * An Item instance maps some properties of an text item from PDFJS
 *
 * @export
 * @class Item
 */
function Item(item) {
  if (item) {
    var str = item.str,
        width = item.width,
        fontName = item.fontName;

    var _item$transform = slicedToArray(item.transform, 6),
        height = _item$transform[3],
        left = _item$transform[4],
        bottom = _item$transform[5];

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

Item.from = function (item, props) {
  var itemSpec = conforms({
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
};

/**
 * A Block instance represents a group of Items
 * @export
 * @class Block
 */
function Block(items, listItem) {
  this.items = Block.order(items);
  this.listItem = listItem;

  this.text = Block.getText(this.items);
  this.lineHeight = Block.frequency('lineHeight', Math.max, items);
  this.fontName = Block.frequency('fontName', Math.max, items);

  this.top = this.items.reduce(function (r, _ref) {
    var top = _ref.top;
    return Math.max(r, top);
  }, 0);
  this.right = this.items.reduce(function (r, _ref2) {
    var right = _ref2.right;
    return Math.max(r, right);
  }, 0);
  this.bottom = this.items.reduce(function (r, _ref3) {
    var bottom = _ref3.bottom;
    return Math.min(r, bottom);
  }, Infinity);
  this.left = this.items.reduce(function (r, _ref4) {
    var left = _ref4.left;
    return Math.min(r, left);
  }, Infinity);
  this.height = this.top - this.bottom;
  this.width = this.right - this.left;
}

Block.from = function () {
  var _flatten$reduce = flatten([].concat(Array.prototype.slice.call(arguments))).reduce(function (_ref5, item) {
    var items = _ref5.items,
        listItem = _ref5.listItem;

    switch (item.constructor) {
      case Block:
        if (item.listItem) {
          return {
            items: [].concat(toConsumableArray(items), toConsumableArray(item.items)),
            listItem: item.listItem
          };
        } else {
          return {
            items: [].concat(toConsumableArray(items), toConsumableArray(item.items)),
            listItem: listItem
          };
        }

      case Item:
        if (item.listItem) {
          return { items: items, listItem: item };
        } else {
          return { items: [].concat(toConsumableArray(items), [item]), listItem: listItem };
        }
      default:
        if (item.listItem && item.listItem.constructor === Item) {
          return { items: items, listItem: item.listItem };
        } else {
          throw new TypeError('Block.from: invalid input type (' + item.constructor.name + ')');
        }
    }
  }, { items: [] }),
      items = _flatten$reduce.items,
      listItem = _flatten$reduce.listItem;
  // get rid of duplicates


  var set$$1 = new Set(items);
  set$$1.delete(listItem);
  return new Block([].concat(toConsumableArray(set$$1)), listItem);
};

Block.getText = function (items) {
  return items.reduce(function (_ref6, item) {
    var text = _ref6.text,
        prev = _ref6.prev;

    if (prev && prev.bottom > item.top && prev.right > item.left) {
      return {
        text: trimEnd(text) + ' ' + trimStart(item.text),
        prev: item
      };
    } else {
      return { text: text + item.text, prev: item };
    }
  }, { text: '', prev: null }).text;
};

Block.frequency = function (key, fn, items) {
  return [].concat(toConsumableArray(items.reduce(function (map$$1, item) {
    var value = item[key];
    var instances = map$$1.get(value) || 0;
    return map$$1.set(value, instances + item.text.length);
  }, new Map()))).map(function (_ref7) {
    var _ref8 = slicedToArray(_ref7, 2),
        value = _ref8[0],
        frequency = _ref8[1];

    return { value: value, frequency: frequency };
  }).reduce(function (r, _ref9) {
    var value = _ref9.value,
        frequency = _ref9.frequency;

    return fn(r.frequency, frequency) === frequency ? { value: value, frequency: frequency } : r;
  }).value;
};

Block.order = function (items) {
  var iteratees = ['bottom', 'right'];
  var orders = ['desc', 'asc'];
  var ordered = orderBy(iteratees, orders, items);

  return ordered;
};

var invalidCharBlock = function invalidCharBlock(_ref) {
  var text = _ref.text;

  var chars = uniq([].concat(toConsumableArray(text))).join('').replace(' ', '');
  return chars.length < 2 || !/[A-Za-z0-9àèìòùñÀÈÌÒÙÑ]/.test(chars);
};

var emptyItem = function emptyItem(_ref2) {
  var text = _ref2.text;
  return !text.trim();
};

var isListHead = function isListHead(text) {
  return (/^[●▪]$/.test(text) || /^(\d{1,2}|[A-Z]|[a-z]|[ivx]{1,3})[.)]?$/.test(text)
  );
};

var isListItem = function isListItem(_ref3) {
  var _ref3$items = slicedToArray(_ref3.items, 2),
      first = _ref3$items[0],
      second = _ref3$items[1];

  return first && second && first.right < second.left && isListHead(first.text);
};

var toListItem = function toListItem(block) {
  if (isListItem(block)) {
    return Block.from(block, { listItem: block.items[0] });
  } else {
    return block;
  }
};

var flattenBlocks = flow(Block.from, get('items'));

/**
 * toPredicate :: a -> (a -> a -> Bool) -> (a -> Bool)
 */
var toPredicate = curry(function (item, comparator) {
  return isFunction(comparator) ? comparator(item) : conforms(mapValues(comparator, function (fn, key) {
    return fn(item[key]);
  }));
});

/**
 * Compare two objects using a comparator array.
 *
 * matchWith :: [comparator] -> a -> (a -> Bool)
 *
 * @param {array} comparators Array of comparator objects or functions
 * @param {object} item1 First object for comparison
 * @param {object} item2 Second object for comparison
 */
var matchWith = curry(function (rules, item1, item2) {
  var predicates = rules.map(toPredicate(item1));
  var result = predicates.every(function (p) {
    return p(item2);
  });
  return result;
});

/**
 * groupBy ::
 *   (item -> item -> Bool) -> [item] -> [block] -> [block]
 * @param {function} matcher Object matcher with rules applied
 */
var groupBy = curry(function (rules, items) {
  // makeBlock :: [item] -> block -> {items, block}
  var makeBlock = groupEach(rules);
  // recurse :: [item] -> [block] -> [block]
  var recurse = function recurse(_ref) {
    var _ref2 = toArray(_ref),
        item = _ref2[0],
        items = _ref2.slice(1);

    var blocks = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    if (!item) {
      return blocks;
    }
    var results = makeBlock({ items: items, block: item });
    return recurse(results.items, [].concat(toConsumableArray(blocks), [results.block]));
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
var groupEach = function groupEach(rules) {
  var matcher = matchWith(rules);

  // Calls itself until all possible items are matched by matcher
  // recurse :: { items, block } -> { items, block }
  var recurse = function recurse(_ref3) {
    var items = _ref3.items,
        block = _ref3.block;

    var filteredItems = items.filter(matcher(block));

    if (filteredItems.length === 0) {
      return { items: items, block: Block.from(block) };
    } else {
      return recurse({
        items: without.apply(undefined, [items].concat(toConsumableArray(filteredItems))),
        block: Block.from.apply(Block, [block].concat(toConsumableArray(filteredItems)))
      });
    }
  };

  return recurse;
};

var inRange = curry(function (start, end, num) {
  var high = Math.max(start, end);
  var low = Math.min(start, end);
  return low <= num && num <= high;
});

var isClose = curry(function (margin, num1, num2) {
  return inRange(num1 + margin, num1 - margin, num2);
});

/**
 * Is one of the item's key values in range?
 *
 * isCloseBy :: [string] -> a -> a -> Bool
 */
var isCloseBy = curry(function (_ref, range, item) {
  var _ref2 = slicedToArray(_ref, 2),
      lo = _ref2[0],
      hi = _ref2[1];

  var isInRange = inRange(range[lo], range[hi]);
  var result = isInRange(item[lo]) || isInRange(item[hi]);
  return result;
});

var xIsClose = isCloseBy(['left', 'right']);
var yIsClose = isCloseBy(['bottom', 'top']);

//   // check that block is list item
//   //   - first item matches bullet or numerator
//   //   - second item is not adjoining first
//   // make new block with first item assigned to {listItem: item}

var secondIsNotList = curry(function (item1, item2) {
  var second = item2.top < item1.bottom ? item2 : item1;
  return !second.listItem;
});

/**
 * Get object with padded boundary properties
 *
 * padItem :: a -> {left, right, bottom, top}
 */
var padItem = function padItem(item) {
  var amount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.7;

  var pad = Math.round(item.lineHeight * amount);
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
var areNeighbors = curry(function (item1, item2) {
  var search = padItem(item1);
  var result = xIsClose(search, item2) && yIsClose(search, item2);
  return result;
});

var sameStyle = function sameStyle() {
  return [{ fontName: isEqual, lineHeight: isEqual }];
};

var sameLine = function sameLine() {
  return [{
    top: isClose(3),
    bottom: isClose(1)
  }];
};

/**
 * Match items that are same style and close to each other
 */
var sameBlock = function sameBlock() {
  var leftMargin = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
  var lineMargin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  return [{
    left: isClose(leftMargin),
    lineHeight: isClose(lineMargin)
  }, areNeighbors, secondIsNotList];
};

/**
 * parseTextItems :: [item] -> [block]
 */
var parseTextItems = flow(groupBy(sameStyle()), reject(invalidCharBlock), flattenBlocks, groupBy(sameLine()), reject(emptyItem), map(toListItem), groupBy(sameBlock()));

exports.parseTextItems = parseTextItems;
exports.Item = Item;
exports.Block = Block;
