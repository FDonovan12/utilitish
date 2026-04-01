import { defineIfNotExists } from '../utils/core.utils';

declare global {
    interface Map<K, V> {
        /**
         * Converts the Map into a list or specific structure based on the selected conversion type.
         * Supports multiple output formats: entries, keys, values, or a plain object.
         *
         * @template K The type of keys in the Map
         * @template V The type of values in the Map
         * @this {Map<K, V>} The Map to convert
         * @param {string} [type='entries'] - The conversion type ('keys' | 'values' | 'entries' | 'object')
         * @returns {any} Converted output as specified by the type parameter
         * @throws {TypeError} If type is 'object' with non-compatible keys or if type is unknown
         *
         * @example
         * const map = new Map([['a', 1], ['b', 2]]);
         * map.toList(); // [['a', 1], ['b', 2]]
         * map.toList('keys'); // ['a', 'b']
         * map.toList('values'); // [1, 2]
         * map.toList('object'); // { a: 1, b: 2 }
         *
         * @remarks
         * - `entries` (default): Returns array of [K, V] pairs
         * - `keys`: Returns array of all keys
         * - `values`: Returns array of all values
         * - `object`: Returns Record with string keys (requires keys to be string/number/symbol)
         */
        toList(type: 'keys'): K[];
        toList(type: 'values'): V[];
        toList(type: 'object'): Record<string, V>;
        toList(type: 'entries'): [K, V][];
        toList(): [K, V][];

        /**
         * Converts a Map to a plain JavaScript object.
         * Each key/value pair in the Map becomes a property/value in the resulting object.
         * Validates that all keys are valid PropertyKey types.
         *
         * @template K Type of keys (must extend PropertyKey: string | number | symbol)
         * @template V Type of values in the Map
         * @this {Map<K, V>} The Map to convert
         * @returns {Record<K, V>} A plain object with Map entries as properties
         * @throws {TypeError} If any key is null, undefined, or not a PropertyKey type
         *
         * @example
         * const map = new Map<string, number>([['a', 1], ['b', 2]]);
         * map.toObject(); // { a: 1, b: 2 }
         *
         * const numKeyMap = new Map<number, string>([[1, 'one'], [2, 'two']]);
         * numKeyMap.toObject(); // { 1: 'one', 2: 'two' }
         *
         * @remarks
         * - Provides validation and error handling for property key compatibility
         * - Supports string, number, and symbol keys
         * - Returns a new object instance each time (no modification to original)
         */
        toObject<K extends PropertyKey, V>(this: Map<K, V>): Record<K, V>;

        /**
         * Ensures that the Map has an entry for the given key with an array as value.
         * If the key doesn't exist, initializes it with an empty array.
         * Validates that the existing value (if any) is indeed an array.
         *
         * @template K Type of keys in the Map
         * @template L The array type stored as values (extends Array<any>)
         * @this {Map<K, L>} The Map where values must be arrays
         * @param {K} key - The key to look up or initialize
         * @returns {L} The array associated with the key (either existing or newly created)
         * @throws {TypeError} If key is null/undefined or if the existing value is not an array
         *
         * @example
         * const map = new Map<string, number[]>();
         * const arr1 = map.ensureArray('items'); // Returns [], and ['items'] => [] is set in map
         * arr1.push(42);
         *
         * const arr2 = map.ensureArray('items'); // Returns same array with [42]
         * arr1 === arr2; // true (same reference)
         *
         * @remarks
         * - Modifies the Map in place (lazy initialization pattern)
         * - Useful for Maps that accumulate items by key
         * - Throws if the existing value for a key is not an array
         * - Key must not be null or undefined
         */
        ensureArray<L extends Array<any>>(this: Map<K, L>, key: K): L;
    }
}

/**
 * @see Map.prototype.toList
 */
defineIfNotExists(Map.prototype, 'toList', function <
    K,
    V,
>(this: Map<K, V>, type: 'entries' | 'keys' | 'values' | 'object' = 'entries'):
    | [K, V][]
    | K[]
    | V[]
    | Record<string, V> {
    switch (type) {
        case 'keys':
            return Array.from(this.keys());
        case 'values':
            return Array.from(this.values());
        case 'object': {
            const obj: Record<string, V> = {};
            for (const [key, value] of this) {
                if (typeof key === 'string' || typeof key === 'number' || typeof key === 'symbol') {
                    // For number keys, convert to string (object keys are always strings or symbols)
                    obj[String(key)] = value;
                } else {
                    throw new TypeError(
                        `Map.prototype.toList('object') only supports string, number, or symbol keys. Got: ${typeof key}`,
                    );
                }
            }
            return obj;
        }
        case 'entries':
            return Array.from(this.entries());
        default:
            throw new TypeError(`Unknown type "${type}" for Map.prototype.toList`);
    }
});

/**
 * @see Map.prototype.toObject
 */
defineIfNotExists(Map.prototype, 'toObject', function <K extends PropertyKey, V>(this: Map<K, V>): Record<K, V> {
    const entries = Array.from(this.entries());

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

    return Object.fromEntries(entries) as Record<K, V>;
});

/**
 * @see Map.prototype.ensureArray
 */
defineIfNotExists(Map.prototype, 'ensureArray', function <K, V>(this: Map<K, V[]>, key: K): V[] {
    if (key === null || key === undefined) {
        throw new TypeError('Key cannot be null or undefined');
    }
    if (!this.has(key)) {
        this.set(key, []);
    }
    const arr = this.get(key);
    if (!Array.isArray(arr)) {
        throw new TypeError('Value for the key is not an array');
    }
    return arr;
});
