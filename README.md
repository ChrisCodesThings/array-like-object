# extensible-read-only-array &middot;  [![Test workflow status](https://github.com/ChrisCodesThings/extensible-read-only-array/actions/workflows/test.yml/badge.svg)](../../actions/workflows/test.yml) [![NPM Version](https://img.shields.io/npm/v/@chriscodesthings/extensible-read-only-array)](https://www.npmjs.com/package/@chriscodesthings/extensible-read-only-array) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

> **Creates a read only array, allowing extension with custom methods**

## Description

Extensible Read Only Array uses a proxy to create a makeshift API to your array. 

The array can be read as normal, with direct requests for specific indexes, the length property and iterator function, however all requests to set an index are blocked.

The array can then be extended by providing an object or class containing your own code.

### See...
- [Install/Usage](#install "Install and Usage")
- [Syntax](#syntax "Syntax")
- [Examples](#examples "Examples")
- [Allowing Array Methods](#allowing-array-methods "Allowing Array Methods")

## Install

```sh
npm install --save @chriscodesthings/extensible-read-only-array
```

## Use

```js
import makeReadOnlyArray from '@chriscodesthings/extensible-read-only-array';

const numbers = makeReadOnlyArray([], {
    next(arr) {
        return arr.push(arr.length);
    }
});

console.log(numbers);
// => []

numbers.next();
numbers.next();
numbers.next();

console.log(numbers);
// => [ 0, 1, 2 ]
```

## Syntax

```js
makeReadOnlyArray(arr, obj, allow, allowDefaults);
```

### Parameters

- *arr*: the array to make read only
- *obj*: your object containing methods/properties for to redirect to
- *allow*: an array containing a list of array methods to allow
- *allowDefaults*: Default `true`. If `false`, blocks access to the methods allowed by default. 

See also, [Allowing Array Methods](#allowing-array-methods "Allowing Array Methods")

### Return Value

Returns a proxy attached to the original array.

## Examples

### Use with a handler object

We can create an array that will only store people's names by using a handler object with a method to add a person to the array.

```js
import makeReadOnlyArray from '@chriscodesthings/extensible-read-only-array';

const peopleHandler = {
    addPerson(first, last, age) {
        const arr = arguments.pop();

        arr[arr.length] = {
            firstname: first,
            lastname: last,
            age: age
        }
    }
};

const people = makeReadOnlyArray([], peopleHandler);
```

### Use with a class

You can use Extensible Read Only Array directly from your constructor to allow read only access to an array, while keeping it private within your class. 

```js
import makeReadOnlyArray from '@chriscodesthings/extensible-read-only-array';

class extendedReadOnlyArrayClass {
    #people = [];

    constructor() {
        return makeReadOnlyArray(this.#arr, this);
    }

    addPerson(first, last, age) {
        this.#arr[this.#arr.length] = {
            firstname: first,
            lastname: last,
            age: age
        }
    }
}

const testArray = new extendedReadOnlyArrayClass();
```

## Allowing Array Methods

Access to the native array methods is divided into 3 categories.

### Always allowed

These properties/methods are always allowed since they are required for normal array iteration.

- `length` property
- `[@@iterator]` method

### Allowed by default

These methods are allowed by default, unless *allowDefaults* is set to `false`. They are all considered to be 'read only' methods which do not modify, or allow modification in any way, of the original array.

There is little point in excluding access to these methods since they could easily be replicated by simply first copying the array contents into a new array, element by element.

- `at`
- `concat`
- `entries`
- `every`
- `find`
- `findIndex`
- `findLast`
- `findLastIndex`
- `orEach`
- `includes`
- `indexOf`
- `join`
- `keys`
- `lastIndexOf`
- `map`
- `reduce`
- `reduceRight`
- `some`
- `toLocaleString`
- `toReversed`
- `toSorted`
- `toSpliced`
- `toString`
- `values`
- `with`

### Allow specific methods

To allow access to certain methods, specify these in an array when creating the Extensible Read Only Array.

For example, to allow access to the `reverse()` and `sort()` methods:
```js
const readOnlyArray = makeReadOnlyArray([], arrayHandler, ["reverse", "sort"]);
```
