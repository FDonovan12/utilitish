import { defineIfNotExists, isNumberOrString, resolveSelector, Selector, utilitishError } from '../utils/core.utils';
import { sortBy } from '../utils/logic.utils';

declare global {
    interface Array<T> {
        /**
         * Returns the first element of the array, or `undefined` if the array is empty.
         *
         * @template T The type of array elements
         * @this {T[]} The array to get the first element from
         * @returns {T | undefined} The first element or undefined if the array is empty
         *
         * @example
         * [1, 2, 3].first(); // 1
         * [].first(); // undefined
         */
        first(): T | undefined;

        /**
         * Returns the last element of the array, or `undefined` if the array is empty.
         *
         * @template T The type of array elements
         * @this {T[]} The array to get the last element from
         * @returns {T | undefined} The last element or undefined if the array is empty
         *
         * @example
         * [1, 2, 3].last(); // 3
         * [].last(); // undefined
         */
        last(): T | undefined;

        /**
         * Calculates the sum of the array values.
         * Supports bare number arrays or objects with a selector to extract numeric values.
         *
         * @template T The type of array elements
         * @this {number[]|T[]} The array to sum
         * @param {Selector<T, number>} [selector] - Optional function or property key to extract numbers
         * @returns {number} The sum of all values (0 for empty arrays)
         * @throws {TypeError} If array is not of type number[] and no selector is provided
         *
         * @example
         * [1, 2, 3].sum(); // 6
         * [].sum(); // 0
         * [{ x: 1 }, { x: 2 }].sum(x => x.x); // 3
         * [{ x: 1 }, { x: 2 }].sum('x'); // 3
         *
         * @remarks
         * - For number arrays, no selector is required
         * - For object arrays, use property key string or callback function
         * - Returns 0 for empty arrays regardless of type
         */
        sum(this: number[]): number;
        sum(this: T[], selector: Selector<T, number>): number;

        /**
         * Returns a new array with only unique elements based on strict equality (===).
         * Preserves order of first occurrence.
         *
         * @template T The type of array elements
         * @this {T[]} The array to filter
         * @returns {T[]} A new array with duplicate values removed
         *
         * @example
         * [1, 1, 2, 2, 3].unique(); // [1, 2, 3]
         * [{id: 1}, {id: 1}, {id: 2}].unique(); // [{id: 1}, {id: 1}, {id: 2}] (objects compared by reference)
         *
         * @remarks
         * - Uses Set internally for efficiency
         * - Only removes duplicates based on strict equality
         * - For object arrays, same reference is considered equal
         */
        unique(): T[];

        /**
         * Splits the array into chunks (sub-arrays) of a specified maximum size.
         *
         * @template T The type of array elements
         * @this {T[]} The array to chunk
         * @param {number} size - Maximum size of each chunk (must be positive integer)
         * @returns {T[][]} A new array of chunks, where each chunk has at most `size` elements
         * @throws {TypeError} If size is not a positive integer
         *
         * @example
         * [1, 2, 3, 4].chunk(2); // [[1, 2], [3, 4]]
         * [1, 2, 3].chunk(2); // [[1, 2], [3]]
         * [1, 2, 3, 4, 5].chunk(2); // [[1, 2], [3, 4], [5]]
         *
         * @remarks
         * - Last chunk may have fewer elements if array length is not divisible by size
         * - Empty array returns an empty array
         */
        chunk(size: number): T[][];

        /**
         * Calculates the average (mean) of the array values.
         * Supports bare number arrays or objects with a selector to extract numeric values.
         *
         * @template T The type of array elements
         * @this {number[]|T[]} The array to average
         * @param {Selector<T, number>} [selector] - Optional function or property key to extract numbers
         * @returns {number} The average of all values (0 for empty arrays)
         * @throws {TypeError} If array is not of type number[] and no selector is provided
         *
         * @example
         * [2, 4, 6].average(); // 4
         * [].average(); // 0
         * [{x: 2}, {x: 4}].average(x => x.x); // 3
         * [{x: 2}, {x: 4}].average('x'); // 3
         *
         * @remarks
         * - For number arrays, no selector is required
         * - Returns 0 for empty arrays (prevents division by zero)
         * - For object arrays, use property key string or callback function
         */
        average(this: number[]): number;
        average(this: T[], selector: Selector<T, number>): number;

        /**
         * Groups array elements into a Map based on a key returned by the selector.
         * Elements with the same key are grouped together in an array.
         *
         * @template T The type of array elements
         * @template K The type of grouping key (extracted from selector)
         * @this {T[]} The array to group
         * @param {Selector<T, K>} selector - Function or property key to extract the grouping key
         * @returns {Map<K, T[]>} A Map where keys map to arrays of grouped items
         *
         * @example
         * const arr = [{type: 'a', v: 1}, {type: 'b', v: 2}, {type: 'a', v: 3}];
         * arr.groupBy('type');
         * // Map { 'a' => [{type: 'a', v: 1}, {type: 'a', v: 3}], 'b' => [{type: 'b', v: 2}] }
         *
         * arr.groupBy(x => x.v % 2);
         * // Map { 1 => [{type: 'a', v: 1}, {type: 'a', v: 3}], 0 => [{type: 'b', v: 2}] }
         *
         * @remarks
         * - Order of groups in Map matches insertion order (first occurrence of key)
         * - Empty array returns an empty Map
         */
        groupBy<K>(this: T[], selector: Selector<T, K>): Map<K, T[]>;

        /**
         * Removes all falsy values from the array.
         * Removes: `false`, `null`, `0`, `""` (empty string), `undefined`, `NaN`.
         *
         * @template T The type of array elements
         * @this {T[]} The array to compact
         * @returns {T[]} A new array with all falsy values removed
         *
         * @example
         * [0, 1, false, 2, '', 3, null, undefined, NaN].compact();
         * // [1, 2, 3]
         *
         * @remarks
         * - Uses JavaScript's falsy value definition
         * - Returns a new array (original is not modified)
         */
        compact(): T[];

        /**
         * Enumerates the array into tuples of [value, index].
         * Similar to Python's enumerate but returns value first.
         *
         * @template T The type of array elements
         * @this {T[]} The array to enumerate
         * @returns {[T, number][]} An array of [value, index] tuples
         *
         * @example
         * ['a', 'b', 'c'].enumerate();
         * // [['a', 0], ['b', 1], ['c', 2]]
         *
         * @remarks
         * - Value comes first (before index), unlike JavaScript's map callback
         * - Index is always the enumeration index (0-based)
         */
        enumerate(): [T, number][];

        /**
         * Returns a new sorted copy of the array in ascending order.
         * Creates a new array without modifying the original.
         *
         * @template T The type of array elements
         * @this {number[]|string[]|T[]} The array to sort
         * @param {Selector<T, number|string>} [selector] - Optional function or property key to extract sortable value
         * @returns {T[]} A new array sorted in ascending order
         * @throws {TypeError} If elements are not sortable or selector returns invalid type
         *
         * @example
         * [3, 1, 2].sortAsc(); // [1, 2, 3]
         * ['c', 'a', 'b'].sortAsc(); // ['a', 'b', 'c']
         * [{v: 2}, {v: 1}].sortAsc(x => x.v); // [{v: 1}, {v: 2}]
         * [{v: 2}, {v: 1}].sortAsc('v'); // [{v: 1}, {v: 2}]
         *
         * @remarks
         * - For primitive arrays, no selector needed (must be number or string)
         * - Selectors must return number or string for comparison
         * - Returns new array; does not mutate original
         * - Empty arrays return empty array
         */
        sortAsc(this: (number | string)[]): T[];
        sortAsc(this: T[], selector: Selector<T, number | string>): T[];

        /**
         * Returns a new sorted copy of the array in descending order.
         * Creates a new array without modifying the original.
         *
         * @template T The type of array elements
         * @this {number[]|string[]|T[]} The array to sort
         * @param {Selector<T, number|string>} [selector] - Optional function or property key to extract sortable value
         * @returns {T[]} A new array sorted in descending order
         * @throws {TypeError} If elements are not sortable or selector returns invalid type
         *
         * @example
         * [1, 3, 2].sortDesc(); // [3, 2, 1]
         * ['a', 'c', 'b'].sortDesc(); // ['c', 'b', 'a']
         * [{v: 1}, {v: 2}].sortDesc(x => x.v); // [{v: 2}, {v: 1}]
         * [{v: 1}, {v: 2}].sortDesc('v'); // [{v: 2}, {v: 1}]
         *
         * @remarks
         * - For primitive arrays, no selector needed (must be number or string)
         * - Selectors must return number or string for comparison
         * - Returns new array; does not mutate original
         * - Empty arrays return empty array
         */
        sortDesc(this: (number | string)[]): T[];
        sortDesc(this: T[], selector: Selector<T, number | string>): T[];

        /**
         * Swaps the elements at two indices within the array.
         * Modifies the array in place and returns the array itself (for chaining).
         *
         * @template T The type of array elements
         * @this {T[]} The array to modify
         * @param {number} i - First index to swap
         * @param {number} j - Second index to swap
         * @returns {T[]} The modified array (same reference as this)
         * @throws {TypeError} If indices are not integers
         * @throws {RangeError} If any index is out of bounds (negative or >= length)
         *
         * @example
         * const arr = [1, 2, 3];
         * arr.swap(0, 2); // arr is now [3, 2, 1]
         * arr === arr.swap(0, 2); // true (returns same array)
         *
         * @remarks
         * - Does nothing if i === j
         * - Modifies original array (not immutable)
         * - Validates both indices are valid integers
         */
        swap(i: number, j: number): this;

        /**
         * Returns a new array with elements shuffled randomly.
         * Uses Fisher-Yates algorithm for uniform distribution.
         * Does not modify the original array.
         *
         * @template T The type of array elements
         * @this {T[]} The array to shuffle
         * @returns {T[]} A new shuffled array
         *
         * @example
         * const arr = [1, 2, 3, 4, 5];
         * const shuffled = arr.shuffle();
         * // shuffled might be [3, 1, 5, 2, 4] (order is random)
         * arr; // [1, 2, 3, 4, 5] (unchanged)
         *
         * @remarks
         * - Returns new array instance (original unchanged)
         * - Uses Math.random() so results vary
         * - Empty arrays return empty array
         * - Fisher-Yates algorithm ensures unbiased distribution
         */
        shuffle(): T[];

        /**
         * Converts an array to a Map using keys and optionally values extracted from elements.
         * Supports multiple input formats: pairs array, property key, or selector functions.
         *
         * @template T The type of array elements
         * @template K The type of Map keys
         * @template V The type of Map values
         * @this {[K, V][]|T[]} The array to convert
         * @param {K | (item: T) => K} [keySelector] - Property key or function to extract keys
         * @param {(item: T) => V} [valueSelector] - Optional function to extract values
         * @returns {Map<K, V>} A Map with extracted key-value pairs
         *
         * @example
         * // From pairs
         * [['a', 1], ['b', 2]].toMap(); // Map { 'a' => 1, 'b' => 2 }
         *
         * // Using property key
         * [{id: 1, name: 'foo'}, {id: 2, name: 'bar'}].toMap('id');
         * // Map { 1 => {id: 1, name: 'foo'}, 2 => {id: 2, name: 'bar'} }
         *
         * // Using selectors
         * [{id: 1, name: 'foo'}].toMap(x => x.id, x => x.name);
         * // Map { 1 => 'foo' }
         *
         * // Default (uses index)
         * ['a', 'b'].toMap();
         * // Map { 0 => 'a', 1 => 'b' }
         *
         * @remarks
         * - For pairs array, no parameters needed
         * - For objects, provide key as string or selector function
         * - Value defaults to the entire element if not specified
         * - Index is used as key if no keySelector provided
         */
        toMap<K, V>(this: [K, V][]): Map<K, V>;
        toMap<K, V>(this: T[], keySelector?: Selector<T, K>, valueSelector?: Selector<T, V>): Map<K | number, V | T>;

        /**
         * Converts an array to a plain JavaScript object using keys and optionally values extracted from elements.
         * Leverages Map.prototype.toObject() internally for consistency and validation.
         *
         * @template T The type of array elements
         * @template K Type of object keys (must be PropertyKey: string | number)
         * @template V Type of object values
         * @this {[K, V][]|T[]} The array to convert
         * @param {K | keyof T | (item: T) => K} [keySelector] - Property key or function to extract keys
         * @param {(item: T) => V} [valueSelector] - Optional function to extract values
         * @returns {Record<K, V>} A plain object with array elements as properties
         * @throws {TypeError} If any key is null, undefined, or not a valid PropertyKey (string/number)
         *
         * @example
         * // From pairs
         * [['a', 1], ['b', 2]].toObject(); // { a: 1, b: 2 }
         *
         * // Using property key
         * [{id: 1, name: 'foo'}, {id: 2, name: 'bar'}].toObject('id');
         * // { 1: {id: 1, name: 'foo'}, 2: {id: 2, name: 'bar'} }
         *
         * // Using selectors
         * [{id: 1, name: 'foo'}].toObject(x => x.id, x => x.name);
         * // { 1: 'foo' }
         *
         * // Default (uses index)
         * ['a', 'b'].toObject();
         * // { 0: 'a', 1: 'b' }
         *
         * @remarks
         * - For pairs array, no parameters needed
         * - For objects, provide key as string or selector function
         * - Value defaults to the entire element if not specified
         * - Index is used as key if no keySelector provided
         * - Validates keys are valid PropertyKeys (not null/undefined)
         * - Symbols are not supported in plain objects
         */
        toObject<K extends PropertyKey, V>(this: [K, V][]): Record<K, V>;
        toObject<K extends PropertyKey, V>(
            this: T[],
            keySelector?: Selector<T, K>,
            valueSelector?: Selector<T, V>,
        ): Record<K | number, V | T>;

        /**
         * Returns a Set containing the unique elements of the array.
         * Optionally applies a selector function or property key to extract values for the Set.
         *
         * @template T The type of array elements
         * @template K The type of selected values for the Set
         * @this {T[]} The array to convert
         * @param {Selector<T, K>} [selector] - Optional property key or function to select values
         * @returns {Set<T | K>} A Set of unique elements or selected values
         *
         * @example
         * [1, 2, 2, 3].toSet(); // Set { 1, 2, 3 }
         *
         * [{id: 1}, {id: 2}, {id: 1}].toSet(x => x.id);
         * // Set { 1, 2 }
         *
         * [{id: 1}, {id: 2}].toSet('id');
         * // Set { 1, 2 }
         *
         * @remarks
         * - Without selector, stores the entire element in the Set
         * - With selector, stores the extracted value instead
         * - Uses Set's built-in uniqueness (based on === equality)
         * - Empty array returns empty Set
         */
        toSet<K>(this: T[], selector?: Selector<T, K>): Set<T | K>;

        /**
         * Groups array elements by a key and counts the occurrences of each key.
         * Returns a Map where keys map to their occurrence counts.
         *
         * @template T The type of array elements
         * @template K The type of grouping key
         * @this {T[]} The array to count
         * @param {Selector<T, K>} [selector] - Optional property key or function to extract grouping key
         * @returns {Map<T | K, number>} A Map where keys map to their occurrence counts
         *
         * @example
         * ['a', 'b', 'a', 'c', 'b', 'a'].countBy();
         * // Map { 'a' => 3, 'b' => 2, 'c' => 1 }
         *
         * [{type: 'x'}, {type: 'y'}, {type: 'x'}].countBy(x => x.type);
         * // Map { 'x' => 2, 'y' => 1 }
         *
         * [{type: 'x'}, {type: 'y'}].countBy('type');
         * // Map { 'x' => 1, 'y' => 1 }
         *
         * @remarks
         * - Without selector, counts entire elements
         * - With selector, counts extracted keys
         * - Uses === equality for counting
         * - Empty array returns empty Map
         */
        countBy<K>(this: T[], selector?: Selector<T, K>): Map<T | K, number>;

        /**
         * Checks if the slugified version of a value matches any slugified string in this array.
         * Useful for case-insensitive and accent-insensitive array search.
         *
         * @this {string[]} The array of strings to search in.
         * @param {string} value - The string to search for.
         * @returns {boolean} `true` if any slugified item in the array equals the slugified `value`, `false` otherwise.
         * @throws {TypeError} If `value` is not a string.
         * @throws {TypeError} If any item in the array is not a string.
         *
         * @example
         * ['Hello World', 'Foo Bar'].slugifyIncludes('hello-world'); // true
         * ['Héllo World', 'Foo Bar'].slugifyIncludes('hello-world'); // true
         * ['Hello World', 'Foo Bar'].slugifyIncludes('baz');         // false
         *
         * @remarks
         * - All strings are slugified before comparison.
         * - Since `slugify` is idempotent, passing an already-slugified value works as expected.
         * - Throws on the first non-string item encountered in the array.
         */
        slugifyIncludes(value: string): boolean;
    }
}

/**
 * @see Array.prototype.first
 */
defineIfNotExists(Array.prototype, 'first', function <T>(this: T[]): T | undefined {
    return this[0];
});

/**
 * @see Array.prototype.last
 */
defineIfNotExists(Array.prototype, 'last', function <T>(this: T[]): T | undefined {
    return this[this.length - 1];
});

/**
 * @see Array.prototype.sum
 */
defineIfNotExists(Array.prototype, 'sum', function <T>(this: T[], selector?: Selector<T, number>): number {
    if (this.length === 0) return 0;
    const getValue = resolveSelector(selector, (item: T) => item as number);
    if (this.every((item) => typeof getValue(item) === 'number')) {
        return this.reduce((acc: number, item: T) => getValue(item) + acc, 0);
    }
    throw new TypeError('Array.prototype.sum() requires a selector who return a number unless array is number[]');
});

/**
 * @see Array.prototype.unique
 */
defineIfNotExists(Array.prototype, 'unique', function <T>(this: T[]): T[] {
    return [...new Set(this)];
});

/**
 * @see Array.prototype.chunk
 */
defineIfNotExists(Array.prototype, 'chunk', function <T>(this: T[], size: number): T[][] {
    if (typeof size !== 'number' || !Number.isInteger(size) || size <= 0) {
        throw new TypeError('Chunk size must be a positive integer');
    }
    const result: T[][] = [];
    for (let i = 0; i < this.length; i += size) {
        result.push(this.slice(i, i + size));
    }
    return result;
});

/**
 * @see Array.prototype.average
 */
defineIfNotExists(Array.prototype, 'average', function <T>(this: T[], selector?: Selector<T, number>): number {
    if (this.length === 0) return 0;
    const getValue = resolveSelector(selector, (item: T) => item as number);
    if (this.every((item) => typeof getValue(item) === 'number')) {
        return this.reduce((acc: number, item: T) => getValue(item) + acc, 0) / this.length;
    }
    throw new TypeError('Array.prototype.average() requires a selector who return a number unless array is number[]');
});

/**
 * @see Array.prototype.groupBy
 */
defineIfNotExists(Array.prototype, 'groupBy', function <T, K>(this: T[], selector?: Selector<T, K>): Map<K, T[]> {
    const getKey = resolveSelector(selector, (item: T) => item as unknown as K);

    const map = new Map<K, T[]>();
    for (const item of this) {
        const key = getKey(item);
        if (!map.has(key)) {
            map.set(key, []);
        }
        map.get(key)!.push(item);
    }
    return map;
});

/**
 * @see Array.prototype.compact
 */
defineIfNotExists(Array.prototype, 'compact', function <T>(this: T[]): T[] {
    return this.filter(Boolean);
});

/**
 * @see Array.prototype.enumerate
 */
defineIfNotExists(Array.prototype, 'enumerate', function <T>(this: T[]): [T, number][] {
    return this.map((value, index) => [value, index]);
});

/**
 * @see Array.prototype.sortAsc
 * @see Array.prototype.sortDesc
 */
defineIfNotExists(Array.prototype, 'sortBy', function <
    T,
>(this: T[], direction: 'asc' | 'desc', selector?: Selector<T, number | string>): T[] {
    if (this.length === 0) return this.slice();

    const getValue = resolveSelector(selector, (item: T) => item as number | string | T);

    if (!selector && !this.every((item) => isNumberOrString(item))) {
        throw new TypeError('Array elements must be number or string if no selector is provided');
    }

    return this.slice().sort((a, b) => {
        const valA = getValue(a);
        const valB = getValue(b);

        if (!isNumberOrString(valA) || !isNumberOrString(valB)) {
            throw new TypeError('Selector must return number or string');
        }

        if (valA > valB) return direction === 'asc' ? 1 : -1;
        if (valA < valB) return direction === 'asc' ? -1 : 1;
        return 0;
    });
});

/**
 * @see Array.prototype.sortAsc
 */
defineIfNotExists(Array.prototype, 'sortAsc', function <T>(this: T[], selector?: Selector<T, number | string>): T[] {
    return sortBy(this, 'asc', selector);
});

/**
 * @see Array.prototype.sortDesc
 */
defineIfNotExists(Array.prototype, 'sortDesc', function <T>(this: T[], selector?: Selector<T, number | string>): T[] {
    return sortBy(this, 'desc', selector);
});

/**
 * @see Array.prototype.swap
 */
defineIfNotExists(Array.prototype, 'swap', function <T>(this: T[], i: number, j: number): T[] {
    if (typeof i !== 'number' || typeof j !== 'number' || !Number.isInteger(i) || !Number.isInteger(j)) {
        throw new TypeError('Indices must be integers');
    }
    if (i < 0 || i >= this.length || j < 0 || j >= this.length) {
        throw new RangeError('Index out of bounds');
    }
    if (i !== j) {
        const temp = this[i];
        this[i] = this[j];
        this[j] = temp;
    }
    return this;
});

/**
 * @see Array.prototype.shuffle
 */
defineIfNotExists(Array.prototype, 'shuffle', function <T>(this: T[]): T[] {
    const arr = this.slice();
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
});

/**
 * @see Array.prototype.toMap
 */
defineIfNotExists(Array.prototype, 'toMap', function <
    T,
    K,
    V,
>(this: T[] | [K, V][], keySelector?: Selector<T, K>, valueSelector?: Selector<T, V>): Map<number | K, V | T> {
    if (!keySelector && this.length && this.every((item) => Array.isArray(item) && item.length === 2)) {
        return new Map(this as [K, V][]);
    }

    const map = new Map<number | K, V | T>();

    const getKey = resolveSelector(keySelector, (_: T, index?: number) => index as number | K);
    const getValue = resolveSelector(valueSelector, (item: T) => item as V | T);

    for (let i = 0; i < this.length; i++) {
        const item = this[i] as T;
        const key = getKey(item, i);
        const value = getValue(item);
        map.set(key, value);
    }
    return map;
});

/**
 * @see Array.prototype.toObject
 */
defineIfNotExists(Array.prototype, 'toObject', function <
    T,
    K extends PropertyKey,
    V,
>(this: T[], keySelector?: Selector<T, K>, valueSelector?: Selector<T, V>): Record<K | number, V | T> {
    let entries: [K | number, V | T][];

    if (!keySelector && this.length && this.every((item) => Array.isArray(item) && item.length === 2)) {
        entries = this as [K, V][];
    } else {
        const getKey = resolveSelector(keySelector, (_: T, index?: number) => index as number | K);
        const getValue = resolveSelector(valueSelector, (item: T) => item as V | T);

        entries = this.map((item, index) => [getKey(item, index), getValue(item)]);
    }

    // Validate keys
    for (const [key] of entries) {
        if (key === null || key === undefined) {
            throw new TypeError(`Invalid key: key cannot be null or undefined. Key received: ${String(key)}`);
        }

        const keyType = typeof key;
        if (keyType !== 'string' && keyType !== 'number' && keyType !== 'symbol') {
            throw new TypeError(
                `Invalid key type: keys must be string, number, or symbol, received ${keyType}. Key value: ${String(key)}`,
            );
        }
    }

    return Object.fromEntries(entries) as Record<K | number, V | T>;
});

/**
 * @see Array.prototype.toSet
 */
defineIfNotExists(Array.prototype, 'toSet', function <T, K>(this: T[], selector?: Selector<T, K>): Set<T | K> {
    const getValue = resolveSelector(selector, (item: T) => item as K | T);
    return new Set(this.map(getValue));
});

/**
 * @see Array.prototype.countBy
 */
defineIfNotExists(Array.prototype, 'countBy', function <T, K>(this: T[], selector?: Selector<T, K>): Map<
    K | T,
    number
> {
    const getKey = resolveSelector(selector, (item: T) => item as K | T);
    const map = new Map<K | T, number>();
    for (const item of this) {
        const key = getKey(item);
        map.set(key, (map.get(key) ?? 0) + 1);
    }
    return map;
});

/**
 * @see Array.prototype.slugifyIncludes
 */
defineIfNotExists(Array.prototype, 'slugifyIncludes', function (this: string[], value: string): boolean {
    if (typeof value !== 'string') utilitishError('Array.prototype.slugifyIncludes', 'must be a string', value);
    const slugified = value.slugify();
    return this.some((item) => {
        if (typeof item !== 'string')
            utilitishError('Array.prototype.slugifyIncludes', 'all array items must be strings', item);
        return item.slugify() === slugified;
    });
});
