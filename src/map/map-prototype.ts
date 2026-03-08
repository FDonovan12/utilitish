import { defineIfNotExists } from '../utils';

export {};

declare global {
    interface Map<K, V> {
        /**
         * Converts the Map into a list or object, depending on the selected type.
         * - `entries` (default): returns `[K, V][]`
         * - `keys`: returns `K[]`
         * - `values`: returns `V[]`
         * - `object`: returns `{ [key: string]: V }`
         */
        toList(type: 'keys'): K[];
        toList(type: 'values'): V[];
        toList(type: 'object'): Record<string, V>;
        toList(type: 'entries'): [K, V][];
        toList(): [K, V][];

        /**
         * Converts a Map to a plain object.
         * - Each key/value pair in the Map becomes a property/value in the object.
         * - Keys must be compatible with `PropertyKey` (string | number | symbol).
         *
         * @example
         * const map = new Map<number, string>([[1, 'a'], [2, 'b']]);
         * map.toObject(); // { 1: 'a', 2: 'b' }
         */
        toObject<K extends PropertyKey, V>(this: Map<K, V>): Record<K, V>;

        /**
         * Ensures that the value for the given key is an array.
         * If the key does not exist, it sets it to an empty array.
         *
         * @param key - The key to look up in the map.
         * @returns The array associated with the key.
         */
        ensureArray<L extends Array<any>>(this: Map<K, L>, key: K): L;
    }
}

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

defineIfNotExists(Map.prototype, 'toObject', function <K extends PropertyKey, V>(this: Map<K, V>): Record<K, V> {
    const obj: Record<PropertyKey, any> = {};

    for (const [key, value] of this) {
        // Validate that key is not null or undefined
        if (key === null || key === undefined) {
            throw new TypeError(`Invalid key: key cannot be null or undefined. Key received: ${String(key)}`);
        }

        const keyType = typeof key;

        // Only allow string, number, or symbol
        if (keyType !== 'string' && keyType !== 'number' && keyType !== 'symbol') {
            throw new TypeError(
                `Invalid key type: keys must be string, number, or symbol, received ${keyType}. Key value: ${String(key)}`,
            );
        }

        obj[key as PropertyKey] = value;
    }

    return obj as Record<K, V>;
});

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
